// 상수 정의
const DOM_IDS = Object.freeze({
  CART_ITEMS: "cart-items",
  CART_TOTAL: "cart-total",
  LOYALTY_POINTS: "loyalty-points",
  PRODUCT_SELECT: "product-select",
  ADD_TO_CART_BTN: "add-to-cart",
  STOCK_STATUS: "stock-status",
});

const ALERT_MESSAGES = Object.freeze({
  OUT_OF_STOCK: "재고가 부족합니다.",
  SURPRISE_SALE: (itemName) => `번개세일! ${itemName}이(가) 20% 할인 중입니다!`,
  RECOMMENDED_SALE: (itemName) =>
    `${itemName}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
});

const DISCOUNT_RATES = Object.freeze({
  FIVE_PERCENT: 0.05,
  TEN_PERCENT: 0.1,
  FIFTEEN_PERCENT: 0.15,
  TWENTY_PERCENT: 0.2,
  TWENTY_FIVE_PERCENT: 0.25,
  SURPRISE_SALE: 0.8,
  RECOMMENDED_SALE: 0.95,
});

const STOCKS = Object.freeze({
  OUT_OF_STOCK: 0,
  LOW_STOCK_THRESHOLD: 5,
});

const ITEMS_REQUIRED_FOR_DISCOUNT = Object.freeze({
  DEFAULT: 10,
  BIG: 30,
});

const INITIAL_QUANTITY = 1;
const TUESDAY = 2;

// 전역 변수
let lastSelectedProductID;

const productList = [
  { id: "p1", name: "상품1", price: 10000, remaining: 50 },
  { id: "p2", name: "상품2", price: 20000, remaining: 30 },
  { id: "p3", name: "상품3", price: 30000, remaining: 20 },
  { id: "p4", name: "상품4", price: 15000, remaining: 0 },
  { id: "p5", name: "상품5", price: 25000, remaining: 10 },
];

// 현재 상품 수량 추출
const extractQuantity = (element) => {
  const textContent = element.textContent;
  const quantity = textContent.split("x ")[1];

  return parseInt(quantity);
};

// 10개 이상 구매시 할인율
const getDiscountRate = (productID) => {
  switch (productID) {
    // 상품1: 10% 할인
    case "p1":
      return DISCOUNT_RATES.TEN_PERCENT;
    // 상품2: 15% 할인
    case "p2":
      return DISCOUNT_RATES.FIFTEEN_PERCENT;
    // 상품3: 20% 할인
    case "p3":
      return DISCOUNT_RATES.TWENTY_PERCENT;
    case "p4":
      return DISCOUNT_RATES.FIVE_PERCENT;
    case "p5":
      return DISCOUNT_RATES.TWENTY_FIVE_PERCENT;
    default:
      return 0;
  }
};

const createSaleInterval = (callback, interval, delay) => {
  setTimeout(() => {
    setInterval(callback, interval);
  }, Math.random() * delay);
};

const setSurpriseSale = () => {
  const luckyItem = productList[Math.floor(Math.random() * productList.length)];

  if (Math.random() < DISCOUNT_RATES.SURPRISE_SALE && luckyItem.remaining > 0) {
    luckyItem.price = Math.round(
      luckyItem.price * DISCOUNT_RATES.SURPRISE_SALE
    );

    alert(ALERT_MESSAGES.SURPRISE_SALE(luckyItem.name));

    renderProductOptions();
  }
};

const setRecommendSale = () => {
  if (lastSelectedProductID) {
    const suggest = productList.find(
      (item) => item.id !== lastSelectedProductID && item.remaining > 0
    );

    if (suggest) {
      alert(ALERT_MESSAGES.RECOMMENDED_SALE(suggest.name));

      suggest.price = Math.round(
        suggest.price * DISCOUNT_RATES.RECOMMENDED_SALE
      );

      renderProductOptions();
    }
  }
};

const setUpSaleEvents = () => {
  // 임의의 시간마다 깜짝세일 20%
  createSaleInterval(setSurpriseSale, 30000, 10000);
  // 추천세일 5%
  createSaleInterval(setRecommendSale, 60000, 20000);
};

// 적립 포인트
const updateLoyaltyPoints = (finalPrice) => {
  let pointStatus = document.getElementById(DOM_IDS.LOYALTY_POINTS);

  const point = Math.floor(finalPrice / 1000);

  if (!pointStatus) {
    pointStatus = document.createElement("span");

    pointStatus.id = DOM_IDS.LOYALTY_POINTS;
    pointStatus.className = "text-blue-500 ml-2";

    document.getElementById(DOM_IDS.CART_TOTAL).appendChild(pointStatus);
  }

  pointStatus.textContent = `(포인트: ${point})`;
};

const setStockMessage = (product) => {
  if (product.remaining <= STOCKS.OUT_OF_STOCK) {
    return `${product.name}: 품절`;
  } else if (product.remaining < STOCKS.LOW_STOCK_THRESHOLD) {
    return `${product.name}: 재고 부족 (${product.remaining}개 남음)`;
  } else {
    return "";
  }
};

// 재고 메시지
const updateStockStatus = () => {
  const stockStatus = document.getElementById(DOM_IDS.STOCK_STATUS);

  stockStatus.textContent = productList
    .map(setStockMessage)
    .filter((msg) => msg !== "")
    .join("\n");
};

// 콤보박스
const renderProductOptions = (selects) => {
  productList.forEach((product) => {
    const productOptions = document.createElement("option");

    productOptions.value = product.id;
    productOptions.textContent = `${product.name} - ${product.price}원`;
    productOptions.disabled = product.remaining === 0;

    selects?.appendChild(productOptions);
  });
};

const renderCartMessage = (finalPrice, discountRate) => {
  const totalDiv = document.getElementById(DOM_IDS.CART_TOTAL);
  totalDiv.textContent = `총액: ${Math.round(finalPrice)}원`;

  if (discountRate > 0) {
    const discountSpan = document.createElement("span");

    discountSpan.className = "text-green-500 ml-2";
    discountSpan.textContent = `(${(discountRate * 100).toFixed(
      1
    )}% 할인 적용)`;

    totalDiv.appendChild(discountSpan);
  }
};

const renderNewItemToCart = ({ id, name, price }) => {
  const carts = document.getElementById(DOM_IDS.CART_ITEMS);
  const newItemDiv = document.createElement("div");

  newItemDiv.id = id;
  newItemDiv.className = "flex justify-between items-center mb-2";
  newItemDiv.innerHTML = `
    <span>${name} - ${price}원 x ${INITIAL_QUANTITY}</span>
    <div>
      <button
        class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
        data-product-id="${id}" 
        data-change="-1">
        -
      </button>
      <button
        class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
        data-product-id="${id}" 
        data-change="1">
        +
      </button>
      <button
        class="remove-item bg-red-500 text-white px-2 py-1 rounded"
        data-product-id="${id}">
        삭제
      </button>
    </div>
  `;

  carts.appendChild(newItemDiv);
};

// 장바구니 계산
const calculateCart = () => {
  // 총 금액과 수량을 초기화
  let finalPrice = 0,
    totalQuantity = 0,
    originalTotal = 0; // 원가

  const cartDiv = document.getElementById(DOM_IDS.CART_ITEMS);
  const cartItems = cartDiv.children;

  for (let i = 0; i < cartItems.length; i++) {
    const targetItem = productList.find(
      (product) => product.id === cartItems[i].id
    );
    const currentQuantity = extractQuantity(cartItems[i].querySelector("span"));
    const currentPrice = targetItem.price * currentQuantity;

    let discount = 0;

    totalQuantity += currentQuantity;
    originalTotal += currentPrice;

    // 10개 이상 구매 시, 상품에 따른 할인율 적용
    if (currentQuantity >= ITEMS_REQUIRED_FOR_DISCOUNT.DEFAULT) {
      discount = getDiscountRate(targetItem.id);
    }

    finalPrice += currentPrice * (1 - discount); // 할인가 적용한 최종가격
  }

  let discountRate = (originalTotal - finalPrice) / originalTotal;

  // 상품 종류와 상관 없이, 30개 이상 구매할 경우 25% 할인
  if (totalQuantity >= ITEMS_REQUIRED_FOR_DISCOUNT.BIG) {
    const bulkOrderDiscount = finalPrice * DISCOUNT_RATES.TWENTY_FIVE_PERCENT;
    const totalDiscount = originalTotal - finalPrice;

    if (bulkOrderDiscount > totalDiscount) {
      finalPrice = originalTotal * (1 - DISCOUNT_RATES.TWENTY_FIVE_PERCENT);
      discountRate = DISCOUNT_RATES.TWENTY_FIVE_PERCENT;
    }
  }

  // 화요일에는 특별할인 10%
  if (new Date().getDay() === TUESDAY) {
    finalPrice *= 1 - DISCOUNT_RATES.TEN_PERCENT;
    discountRate = Math.max(discountRate, DISCOUNT_RATES.TEN_PERCENT);
  }

  // UI 업데이트
  renderCartMessage(finalPrice, discountRate);
  updateStockStatus();
  updateLoyaltyPoints(finalPrice);
};

const reduceCartItem = (itemDiv, remaining, currentQuantity) => {
  itemDiv.remove();
  // 장바구니에서 제거한 만큼 재고 복원
  remaining += currentQuantity;
};

// 수량 변경
const updateCartQuantity = (itemDiv, quantityChange, product) => {
  const itemSpan = itemDiv.querySelector("span");
  const currentQuantity = extractQuantity(itemSpan);
  const newQuantity = currentQuantity + quantityChange;

  if (newQuantity > product.remaining + currentQuantity) {
    alert(ALERT_MESSAGES.OUT_OF_STOCK);
    return;
  }

  if (newQuantity > 0) {
    itemSpan.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
    product.remaining -= quantityChange;
  } else {
    reduceCartItem(itemDiv, product.remaining);
  }
};

// 장바구니 추가
const handleAddToCart = () => {
  const selectedItem = document.getElementById(DOM_IDS.PRODUCT_SELECT);
  const selectedID = selectedItem.value;
  const itemToAdd = productList.find((product) => product.id === selectedID);

  if (itemToAdd.remaining > 0) {
    const itemInCart = document.getElementById(itemToAdd.id);

    // 기존에 장바구니에 추가되어있을 때
    if (itemInCart) {
      const quantitySpan = itemInCart.querySelector("span");

      const currentQuantity = extractQuantity(quantitySpan) + 1;

      if (itemToAdd.remaining < currentQuantity) {
        alert(ALERT_MESSAGES.OUT_OF_STOCK);
        return;
      }

      quantitySpan.textContent = `${itemToAdd.name} - ${itemToAdd.price}원 x ${currentQuantity}`;
      itemToAdd.remaining--;
    }
    // 장바구니에 새로 추가할 때
    else {
      renderNewItemToCart(itemToAdd);
      itemToAdd.remaining--;
    }

    // 장바구니 계산
    calculateCart();

    // 최근 선택 상품 업데이트
    lastSelectedProductID = itemToAdd.id;
  }
};

// 클릭 이벤트
const handleClickCart = (event) => {
  const clickedBtn = event.target; // 수량 변경 클릭한 버튼
  if (!clickedBtn) return;

  const { productId, change } = clickedBtn.dataset || {}; // 클릭한 버튼의 ID (왜냐면 상품명-버튼 한 row라서)

  const product = productList.find((product) => product.id === productId); // productList에서 해당 아이템 찾기

  const itemDiv = document.getElementById(productId); // (id로 element조회)
  const quantitySpan = itemDiv.querySelector("span");
  const itemQuantity = extractQuantity(quantitySpan);

  // 수량 변경
  if (clickedBtn.classList.contains("quantity-change")) {
    const quantityChange = parseInt(change);
    updateCartQuantity(itemDiv, quantityChange, product);
  }
  // 삭제
  else if (clickedBtn.classList.contains("remove-item")) {
    reduceCartItem(itemDiv, product, itemQuantity);
  }

  calculateCart();
};

function main() {
  const root = document.getElementById("app");

  const containerDiv = document.createElement("div");
  containerDiv.className = "bg-gray-100 p-8";

  const wrapDiv = document.createElement("div");
  wrapDiv.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";

  const cartH1 = document.createElement("h1");
  cartH1.className = "text-2xl font-bold mb-4";
  cartH1.textContent = "장바구니";

  const cartDiv = document.createElement("div");
  cartDiv.id = DOM_IDS.CART_ITEMS;

  const totalDiv = document.createElement("div");
  totalDiv.id = DOM_IDS.CART_TOTAL;
  totalDiv.className = "text-xl font-bold my-4";

  const productSelects = document.createElement("select");
  productSelects.id = DOM_IDS.PRODUCT_SELECT;
  productSelects.className = "border rounded p-2 mr-2";

  const addBtn = document.createElement("button");
  addBtn.id = DOM_IDS.ADD_TO_CART_BTN;
  addBtn.className = "bg-blue-500 text-white px-4 py-2 rounded";
  addBtn.textContent = "추가";

  const stockInfo = document.createElement("div");
  stockInfo.id = DOM_IDS.STOCK_STATUS;
  stockInfo.className = "text-sm text-gray-500 mt-2";

  // 제품 옵션 렌더링
  renderProductOptions(productSelects);

  // DOM 구조 구성
  wrapDiv.appendChild(cartH1);
  wrapDiv.appendChild(cartDiv);
  wrapDiv.appendChild(totalDiv);
  wrapDiv.appendChild(productSelects);
  wrapDiv.appendChild(addBtn);
  wrapDiv.appendChild(stockInfo);

  containerDiv.appendChild(wrapDiv);

  root.appendChild(containerDiv);

  // 장바구니 계산
  calculateCart();

  // 할인 세일 설정
  setUpSaleEvents();
}

// 초기화 및 이벤트 리스너 등록
main();

document
  .getElementById(DOM_IDS.ADD_TO_CART_BTN)
  .addEventListener("click", handleAddToCart);

document
  .getElementById(DOM_IDS.CART_ITEMS)
  .addEventListener("click", handleClickCart);
