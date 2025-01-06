let sel, addBtn, sum, stockInfo;

let carts = document.getElementById("carts"); // 초기화 시 캐싱

let lastSelectedProduct,
  totalPrice = 0,
  totalQuantity = 0;

const RATES = {
  "5%": 0.05,
  "10%": 0.1,
  "15%": 0.15,
  "20%": 0.2,
  "25%": 0.25,
};

const productList = [
  { id: "p1", name: "상품1", price: 10000, remaining: 50 },
  { id: "p2", name: "상품2", price: 20000, remaining: 30 },
  { id: "p3", name: "상품3", price: 30000, remaining: 20 },
  { id: "p4", name: "상품4", price: 15000, remaining: 0 },
  { id: "p5", name: "상품5", price: 25000, remaining: 10 },
];

// 현재 상품 수량 추출
const parseQuantity = (element) => {
  const textContent = element.textContent;
  const quantity = textContent.split("x ")[1];

  return parseInt(quantity);
};

// 적립 포인트
const updateLoyaltyPoints = () => {
  let loyaltyPoints = document.getElementById("loyalty-points");

  const point = Math.floor(totalPrice / 1000);

  if (!loyaltyPoints) {
    loyaltyPoints = document.createElement("span");

    loyaltyPoints.id = "loyalty-points";
    loyaltyPoints.className = "text-blue-500 ml-2";

    sum.appendChild(loyaltyPoints);
  }

  loyaltyPoints.textContent = `(포인트: ${point})`;
};

// 재고 메시지
const updateStockInfo = () => {
  let msg = "";

  productList.forEach((product) => {
    const { name, remaining } = product;

    if (remaining < 5) {
      msg += `\n ${name}: ${
        remaining > 0 ? `재고 부족 (${remaining}개 남음)` : "품절"
      }`;
    }
  });

  stockInfo.textContent = msg;
};

// 콤보박스
const renderProductOptions = () => {
  productList.forEach((product) => {
    const productOptions = document.createElement("option");

    productOptions.value = product.id;
    productOptions.textContent = `${product.name} - ${product.price}원`;
    productOptions.disabled = product.remaining === 0;

    sel.appendChild(productOptions);
  });
};

// 장바구니 계산
const handleCalcCart = () => {
  // 총 금액과 수량을 초기화
  totalPrice = 0;
  totalQuantity = 0;

  const cartItems = carts.children;

  let subTot = 0;

  for (let i = 0; i < cartItems.length; i++) {
    const targetItem = productList.find(
      (product) => product.id === cartItems[i].id
    );

    let quantity = parseInt(
      cartItems[i].querySelector("span").textContent.split("x ")[1]
    );
    let sumPrice = targetItem.price * quantity;
    let discount = 0;

    totalQuantity += quantity;
    subTot += sumPrice;

    if (quantity >= 10) {
      // 상품1 > 10개 이상 구매 시 10% 할인
      if (targetItem.id === "p1") discount = RATES["10%"];
      // 상품2 > 10개 이상 구매 시 15% 할인
      else if (targetItem.id === "p2") discount = RATES["15%"];
      // 상품3 > 10개 이상 구매 시 20% 할인
      else if (targetItem.id === "p3") discount = RATES["20%"];
      else if (targetItem.id === "p4") discount = RATES["5%"];
      else if (targetItem.id === "p5") discount = RATES["25%"];
    }

    totalPrice += sumPrice * (1 - discount);

    console.log("totalPrice", totalPrice, "subtot", subTot);
  }

  let discRate = 0;

  // 상품 종류와 상관 없이, 30개 이상 구매할 경우 25% 할인
  if (totalQuantity >= 30) {
    let bulkDisc = totalPrice * RATES["25%"];
    let itemDisc = subTot - totalPrice;

    if (bulkDisc > itemDisc) {
      totalPrice = subTot * (1 - RATES["25%"]);
      discRate = RATES["25%"];
    } else {
      discRate = (subTot - totalPrice) / subTot;
    }
  } else {
    discRate = (subTot - totalPrice) / subTot;
  }

  // 화요일에는 특별할인 10%
  if (new Date().getDay() === 2) {
    totalPrice *= 1 - RATES["10%"];
    discRate = Math.max(discRate, RATES["10%"]);
  }

  sum.textContent = `총액: ${Math.round(totalPrice)}원`;

  if (discRate > 0) {
    let span = document.createElement("span");

    span.className = "text-green-500 ml-2";
    span.textContent = `(${(discRate * 100).toFixed(1)}% 할인 적용)`;

    sum.appendChild(span);
  }

  updateStockInfo();

  updateLoyaltyPoints();
};

const renderNewItemToCart = ({ id, name, price }) => {
  const carts = document.getElementById("cart-items");
  const newItemDiv = document.createElement("div");

  newItemDiv.id = id;
  newItemDiv.className = "flex justify-between items-center mb-2";
  newItemDiv.innerHTML = `
    <span>${name} - ${price}원 x 1</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${id}">삭제</button>
    </div>
  `;

  carts.appendChild(newItemDiv);
};

// 장바구니 추가
const handleAddToCart = () => {
  const selectedItem = document.getElementById("product-select");
  const selectedID = selectedItem.value;
  const itemToAdd = productList.find((product) => product.id === selectedID);

  if (itemToAdd.remaining > 0) {
    const inCartItem = document.getElementById(itemToAdd.id);

    // 기존에 장바구니에 추가되어있을 때
    if (inCartItem) {
      const quantitySpan = inCartItem.querySelector("span");

      const currentQuantity = parseQuantity(quantitySpan) + 1;

      if (itemToAdd.remaining < currentQuantity) {
        alert("재고가 부족합니다.");
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
    handleCalcCart();
    lastSelectedProduct = itemToAdd.id;
  }
};

const reduceCartItem = (itemDiv, remaining, currentQuantity) => {
  itemDiv.remove();
  // 장바구니에서 제거한 만큼 재고 복원
  remaining += currentQuantity;
};

// 수량 변경
const updateCartQuantity = (
  itemDiv,
  quantityChange,
  { name, remaining, price }
) => {
  const itemSpan = itemDiv.querySelector("span");
  const currentQuantity = parseQuantity(itemSpan);
  const newQuantity = currentQuantity + quantityChange;

  if (newQuantity > remaining + currentQuantity) {
    alert("재고가 부족합니다.");
    return;
  }

  if (newQuantity > 0) {
    itemSpan.textContent = `${name} - ${price}원 x ${newQuantity}`;
    remaining -= quantityChange;
  } else {
    reduceCartItem(itemDiv, remaining);
  }
};

// 클릭 이벤트
const handleClickCart = (event) => {
  const clickedBtn = event.target; // 수량 변경 클릭한 버튼
  if (!clickedBtn) return;

  const { productId, change } = clickedBtn.dataset; // 클릭한 버튼의 ID (왜냐면 상품명-버튼 한 row라서)

  const product = productList.find((product) => product.id === productId); // productList에서 해당 아이템 찾기

  const itemDiv = document.getElementById(productId); // (id로 element조회)
  const quantitySpan = itemDiv.querySelector("span");
  const itemQuantity = parseQuantity(quantitySpan);

  // 수량 변경
  if (clickedBtn.classList.contains("quantity-change")) {
    const quantityChange = parseInt(change);
    updateCartQuantity(itemDiv, quantityChange, product);
  }
  // 삭제
  else if (clickedBtn.classList.contains("remove-item")) {
    reduceCartItem(itemDiv, product, itemQuantity);
  }

  handleCalcCart();
};

function main() {
  let root = document.getElementById("app");

  let cont = document.createElement("div");
  let wrap = document.createElement("div");
  let hTxt = document.createElement("h1");

  carts = document.createElement("div");
  sum = document.createElement("div");
  sel = document.createElement("select");
  addBtn = document.createElement("button");
  stockInfo = document.createElement("div");

  carts.id = "cart-items";
  sum.id = "cart-total";
  sel.id = "product-select";
  addBtn.id = "add-to-cart";
  stockInfo.id = "stock-status";

  cont.className = "bg-gray-100 p-8";
  wrap.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";
  hTxt.className = "text-2xl font-bold mb-4";
  sum.className = "text-xl font-bold my-4";
  sel.className = "border rounded p-2 mr-2";
  addBtn.className = "bg-blue-500 text-white px-4 py-2 rounded";
  stockInfo.className = "text-sm text-gray-500 mt-2";

  hTxt.textContent = "장바구니";
  addBtn.textContent = "추가";

  renderProductOptions();

  wrap.appendChild(hTxt);
  wrap.appendChild(carts);
  wrap.appendChild(sum);
  wrap.appendChild(sel);
  wrap.appendChild(addBtn);
  wrap.appendChild(stockInfo);

  cont.appendChild(wrap);

  root.appendChild(cont);

  handleCalcCart();

  // 임의의 시간마다 깜짝세일 20%
  setTimeout(() => {
    setInterval(() => {
      let luckyItem =
        productList[Math.floor(Math.random() * productList.length)];

      if (Math.random() < 0.3 && luckyItem.remaining > 0) {
        luckyItem.price = Math.round(luckyItem.price * (1 - RATES["20%"]));

        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);

        renderProductOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  // 추천세일 5%
  setTimeout(() => {
    setInterval(() => {
      if (lastSelectedProduct) {
        let suggest = productList.find(
          (item) => item.id !== lastSelectedProduct && item.remaining > 0
        );

        if (suggest) {
          alert(
            `${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
          );
          suggest.price = Math.round(suggest.price * (1 - RATES["5%"]));
          renderProductOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

main();

addBtn.addEventListener("click", handleAddToCart);
carts.addEventListener("click", handleClickCart);
