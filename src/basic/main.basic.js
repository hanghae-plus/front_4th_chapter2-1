/* 데이터 정의 */
const PRODUCTS = [
  { id: "p1", name: "상품1", val: 10000, q: 50 },
  { id: "p2", name: "상품2", val: 20000, q: 30 },
  { id: "p3", name: "상품3", val: 30000, q: 20 },
  { id: "p4", name: "상품4", val: 15000, q: 0 },
  { id: "p5", name: "상품5", val: 25000, q: 10 },
];

const INDIVIDUAL_DISCOUNTS = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

/* 상태 관리 */
function createStore(initialState) {
  const state = { ...initialState };
  const listeners = new Set();

  return {
    getState: () => state,
    update: (newState) => {
      Object.assign(state, newState);
      listeners.forEach((listener) => listener(state));
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/* 할인 계산 로직 */
// 10개 이상 구매 시 상품별 할인율 반환
function getIndividualDiscountRate(productId, quantity) {
  return quantity >= 10 ? (INDIVIDUAL_DISCOUNTS[productId] ?? 0) : 0;
}

// reduce 콜백: 상품별 합계 및 할인 계산
function accumulateItem(acc, itemElem, products) {
  const productId = itemElem.id;
  const quantity = parseInt(
    itemElem.querySelector("span").textContent.split("x ")[1],
    10,
  );
  const product = products.find((p) => p.id === productId);

  const itemTotal = product.val * quantity;
  const discRate = getIndividualDiscountRate(productId, quantity);
  const discountedItemTotal = itemTotal * (1 - discRate);

  const newItems = new Map(acc.items);
  newItems.set(productId, { quantity, product });

  return {
    ...acc,
    items: newItems,
    subTotal: acc.subTotal + itemTotal,
    totalAmt: acc.totalAmt + discountedItemTotal,
    itemCount: acc.itemCount + quantity,
  };
}

// 대량 구매 할인 적용
function applyBulkDiscount({ subTotal, totalAmt, itemCount, items }) {
  if (itemCount < 30) {
    const existedRate = subTotal === 0 ? 0 : (subTotal - totalAmt) / subTotal;
    return { total: totalAmt, discountRate: existedRate, items };
  }

  const bulkDiscountAmount = subTotal * 0.25;
  const individualDiscountAmount = subTotal - totalAmt;

  if (bulkDiscountAmount > individualDiscountAmount) {
    return { total: subTotal * 0.75, discountRate: 0.25, items };
  }

  const existedRate = (subTotal - totalAmt) / subTotal;
  return { total: totalAmt, discountRate: existedRate, items };
}

// 화요일 할인 적용
function applyTuesdayDiscount({ currentTotal, currentRate, items }) {
  if (new Date().getDay() !== 2) {
    return { total: currentTotal, discountRate: currentRate, items };
  }
  return {
    total: currentTotal * 0.9,
    discountRate: Math.max(currentRate, 0.1),
    items,
  };
}

// 장바구니 계산
function calculateCart(cartItems, products) {
  const { subTotal, totalAmt, itemCount, items } = cartItems.reduce(
    (acc, itemElem) => accumulateItem(acc, itemElem, products),
    { subTotal: 0, totalAmt: 0, itemCount: 0, items: new Map() },
  );

  const afterBulk = applyBulkDiscount({ subTotal, totalAmt, itemCount, items });
  const finalRes = applyTuesdayDiscount({
    currentTotal: afterBulk.total,
    currentRate: afterBulk.discountRate,
    items: afterBulk.items,
  });

  return {
    total: finalRes.total,
    discountRate: finalRes.discountRate,
    count: itemCount,
    items: finalRes.items,
  };
}

/* UI 관련 함수 */
// UI 요소 생성
function createUIElement(tag, { id, className, textContent } = {}) {
  const element = document.createElement(tag);
  if (id) element.id = id;
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
}

// 상품 옵션 렌더링
function renderProductOptions(select, products) {
  select.innerHTML = "";
  products.forEach((item) => {
    const option = createUIElement("option");
    option.value = item.id;
    option.textContent = `${item.name} - ${item.val}원`;
    option.disabled = item.q === 0;
    select.appendChild(option);
  });
}

// 총액 렌더링
function renderTotal(total, totalEl, discountRate = 0) {
  totalEl.innerHTML = `총액: ${Math.round(total)}원`;

  if (discountRate > 0) {
    const discountEl = createUIElement("span", {
      className: "text-green-500 ml-2",
      textContent: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`,
    });
    totalEl.appendChild(discountEl);
  }

  let pointsEl = document.getElementById("loyalty-points");
  if (!pointsEl) {
    pointsEl = createUIElement("span", {
      id: "loyalty-points",
      className: "text-blue-500 ml-2",
    });
    totalEl.appendChild(pointsEl);
  }
  pointsEl.textContent = `(포인트: ${Math.floor(total / 1000)})`;
}

// 재고 정보 렌더링
function renderStockInfo(stockEl, products) {
  const lowStockProducts = products.filter((item) => item.q < 5);
  stockEl.textContent = lowStockProducts
    .map(
      (item) =>
        `${item.name}: ${item.q > 0 ? `재고 부족 (${item.q}개 남음)` : "품절"}`,
    )
    .join("\n");
}

// 장바구니 항목 생성
function createCartItem(product) {
  const item = createUIElement("div", {
    id: product.id,
    className: "flex justify-between items-center mb-2",
  });

  item.innerHTML = `
      <span>${product.name} - ${product.val}원 x 1</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
          data-product-id="${product.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
          data-product-id="${product.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
          data-product-id="${product.id}">삭제</button>
      </div>
    `;
  return item;
}
/* UI 요소 생성 */
function createUIElements() {
  return {
    container: createUIElement("div", { className: "bg-gray-100 p-8" }),
    wrapper: createUIElement("div", {
      className:
        "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8",
    }),
    title: createUIElement("h1", {
      className: "text-2xl font-bold mb-4",
      textContent: "장바구니",
    }),
    cartDisplay: createUIElement("div", { id: "cart-items" }),
    total: createUIElement("div", {
      id: "cart-total",
      className: "text-xl font-bold my-4",
    }),
    productSelect: createUIElement("select", {
      id: "product-select",
      className: "border rounded p-2 mr-2",
    }),
    addButton: createUIElement("button", {
      id: "add-to-cart",
      className: "bg-blue-500 text-white px-4 py-2 rounded",
      textContent: "추가",
    }),
    stockInfo: createUIElement("div", {
      id: "stock-status",
      className: "text-sm text-gray-500 mt-2",
    }),
  };
}

/* UI 요소 DOM에 추가 */
function appendUIElements(root, elements) {
  elements.wrapper.append(
    elements.title,
    elements.cartDisplay,
    elements.total,
    elements.productSelect,
    elements.addButton,
    elements.stockInfo,
  );
  elements.container.appendChild(elements.wrapper);
  root.appendChild(elements.container);
}

/* [장바구니에 추가] 버튼 이벤트 */
function setupAddButtonEvent(elements, store) {
  elements.addButton.addEventListener("click", () => {
    const state = store.getState();
    const selectedId = elements.productSelect.value;
    const product = state.products.find((p) => p.id === selectedId);

    if (!product || product.q <= 0) {
      alert("재고가 부족합니다.");
      return;
    }

    const existingItem = document.getElementById(selectedId);
    if (existingItem) {
      const currentQty = parseInt(
        existingItem.querySelector("span").textContent.split("x ")[1],
      );
      const newQty = currentQty + 1;

      if (newQty <= product.q + currentQty) {
        existingItem.querySelector("span").textContent =
          `${product.name} - ${product.val}원 x ${newQty}`;

        store.update({
          products: state.products.map((p) =>
            p.id === selectedId ? { ...p, q: p.q - 1 } : p,
          ),
        });
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      elements.cartDisplay.appendChild(createCartItem(product));
      store.update({
        products: state.products.map((p) =>
          p.id === selectedId ? { ...p, q: p.q - 1 } : p,
        ),
      });
    }

    const cartResult = calculateCart(
      Array.from(elements.cartDisplay.children),
      store.getState().products,
    );
    renderTotal(cartResult.total, elements.total, cartResult.discountRate);
    renderStockInfo(elements.stockInfo, store.getState().products);
  });
}

/* 장바구니 내 버튼들(+/-/삭제) 이벤트 */
function setupCartButtonEvents(elements, store) {
  elements.cartDisplay.addEventListener("click", (event) => {
    const button = event.target;
    if (!button.matches("button")) return;

    const state = store.getState();
    const productId = button.dataset.productId;
    const itemElement = document.getElementById(productId);
    const product = state.products.find((p) => p.id === productId);

    if (button.classList.contains("remove-item")) {
      const quantity = parseInt(
        itemElement.querySelector("span").textContent.split("x ")[1],
      );
      itemElement.remove();
      store.update({
        products: state.products.map((p) =>
          p.id === productId ? { ...p, q: p.q + quantity } : p,
        ),
      });
    } else if (button.classList.contains("quantity-change")) {
      const change = parseInt(button.dataset.change);
      const currentQty = parseInt(
        itemElement.querySelector("span").textContent.split("x ")[1],
      );
      const newQty = currentQty + change;

      if (change > 0 && product.q <= 0) {
        alert("재고가 부족합니다.");
        return;
      }
      if (newQty <= 0) {
        itemElement.remove();
      } else {
        itemElement.querySelector("span").textContent =
          `${product.name} - ${product.val}원 x ${newQty}`;
      }

      store.update({
        products: state.products.map((p) =>
          p.id === productId ? { ...p, q: p.q - change } : p,
        ),
      });
    }

    const cartResult = calculateCart(
      Array.from(elements.cartDisplay.children),
      store.getState().products,
    );
    renderTotal(cartResult.total, elements.total, cartResult.discountRate);
    renderStockInfo(elements.stockInfo, store.getState().products);
  });
}

/* 앱 초기화 */
function initializeApp() {
  const store = createStore({
    products: [...PRODUCTS],
    lastSelected: null,
  });

  const root = document.getElementById("app");
  const elements = createUIElements();

  appendUIElements(root, elements);
  renderProductOptions(elements.productSelect, store.getState().products);
  renderTotal(0, elements.total);
  renderStockInfo(elements.stockInfo, store.getState().products);

  setupAddButtonEvent(elements, store);
  setupCartButtonEvents(elements, store);
}

initializeApp();
