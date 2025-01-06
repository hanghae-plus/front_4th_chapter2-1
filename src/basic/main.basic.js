// 상수 정의
const DISCOUNT_RATES = {
  "5%": 0.05,
  "10%": 0.1,
  "15%": 0.15,
  "20%": 0.2,
  "25%": 0.25,
};

// 전역 변수
let lastSelectedProduct;

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

// 할인율 적용
const setDiscountRates = (productID) => {
  switch (productID) {
    // 상품1 > 10개 이상 구매 시 10% 할인
    case "p1":
      return DISCOUNT_RATES["10%"];
    // 상품2 > 10개 이상 구매 시 15% 할인
    case "p2":
      return DISCOUNT_RATES["15%"];
    // 상품3 > 10개 이상 구매 시 20% 할인
    case "p3":
      return DISCOUNT_RATES["20%"];
    case "p4":
      return DISCOUNT_RATES["5%"];
    case "p5":
      return DISCOUNT_RATES["25%"];
    default:
      return 0;
  }
};

const setUpEvents = () => {
  // 임의의 시간마다 깜짝세일 20%
  setTimeout(() => {
    setInterval(() => {
      const luckyItem = productList[Math.floor(Math.random() * productList.length)];

      if (Math.random() < 0.3 && luckyItem.remaining > 0) {
        luckyItem.price = Math.round(luckyItem.price * (1 - DISCOUNT_RATES["20%"]));

        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);

        renderProductOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  // 추천세일 5%
  setTimeout(() => {
    setInterval(() => {
      if (lastSelectedProduct) {
        const suggest = productList.find((item) => item.id !== lastSelectedProduct && item.remaining > 0);

        if (suggest) {
          alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);

          suggest.price = Math.round(suggest.price * (1 - DISCOUNT_RATES["5%"]));

          renderProductOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};

// 적립 포인트
const updateLoyaltyPoints = (finalPrice) => {
  let loyaltyPoints = document.getElementById("loyalty-points");

  const point = Math.floor(finalPrice / 1000);

  if (!loyaltyPoints) {
    loyaltyPoints = document.createElement("span");

    loyaltyPoints.id = "loyalty-points";
    loyaltyPoints.className = "text-blue-500 ml-2";

    document.getElementById("cart-total").appendChild(loyaltyPoints);
  }

  loyaltyPoints.textContent = `(포인트: ${point})`;
};

// 재고 메시지
const updateStockInfo = () => {
  const stockInfo = document.getElementById("stock-status");

  let stockMessage = "";

  productList.forEach((product) => {
    const { name, remaining } = product;
    const isWarningSoldOut = () => remaining < 5;

    if (isWarningSoldOut) {
      stockMessage += `\n ${name}: ${remaining > 0 ? `재고 부족 (${remaining}개 남음)` : "품절"}`;
    }
  });

  stockInfo.textContent = stockMessage;
};

// 콤보박스
const renderProductOptions = (selects) => {
  productList.forEach((product) => {
    const productOptions = document.createElement("option");

    productOptions.value = product.id;
    productOptions.textContent = `${product.name} - ${product.price}원`;
    productOptions.disabled = product.remaining === 0;

    selects.appendChild(productOptions);
  });
};

const renderCartMessage = (finalPrice, discountRate) => {
  const totalDiv = document.getElementById("cart-total");
  totalDiv.textContent = `총액: ${Math.round(finalPrice)}원`;

  if (discountRate > 0) {
    const discountSpan = document.createElement("span");

    discountSpan.className = "text-green-500 ml-2";
    discountSpan.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;

    totalDiv.appendChild(discountSpan);
  }
};

const renderNewItemToCart = ({ id, name, price }) => {
  const carts = document.getElementById("cart-items");
  const newItemDiv = document.createElement("div");

  newItemDiv.id = id;
  newItemDiv.className = "flex justify-between items-center mb-2";
  newItemDiv.innerHTML = `
    <span>${name} - ${price}원 x 1</span>
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
  let finalPrice = 0;
  let totalQuantity = 0;

  const cartDiv = document.getElementById("cart-items");
  const cartItems = cartDiv.children;

  let originalTotal = 0; // 원가

  for (let i = 0; i < cartItems.length; i++) {
    const targetItem = productList.find((product) => product.id === cartItems[i].id);
    const quantity = parseQuantity(cartItems[i].querySelector("span"));
    const itemTotalPrice = targetItem.price * quantity;

    let discount = 0;

    totalQuantity += quantity;
    originalTotal += itemTotalPrice;

    if (quantity >= 10) {
      discount = setDiscountRates(targetItem.id);
    }

    finalPrice += itemTotalPrice * (1 - discount); // 할인가 적용한 최종가격
  }

  let discountRate = (originalTotal - finalPrice) / originalTotal;

  // 상품 종류와 상관 없이, 30개 이상 구매할 경우 25% 할인
  if (totalQuantity >= 30) {
    const bulkOrderDiscount = finalPrice * DISCOUNT_RATES["25%"];
    const totalDiscount = originalTotal - finalPrice;

    if (bulkOrderDiscount > totalDiscount) {
      finalPrice = originalTotal * (1 - DISCOUNT_RATES["25%"]);
      discountRate = DISCOUNT_RATES["25%"];
    }
  }

  // 화요일에는 특별할인 10%
  if (new Date().getDay() === 2) {
    finalPrice *= 1 - DISCOUNT_RATES["10%"];
    discountRate = Math.max(discountRate, DISCOUNT_RATES["10%"]);
  }

  // UI 업데이트
  renderCartMessage(finalPrice, discountRate);
  updateStockInfo();
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
  const currentQuantity = parseQuantity(itemSpan);
  const newQuantity = currentQuantity + quantityChange;

  if (newQuantity > product.remaining + currentQuantity) {
    alert("재고가 부족합니다.");
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
    calculateCart();
    lastSelectedProduct = itemToAdd.id;
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

  calculateCart();
};

function main() {
  const root = document.getElementById("app");

  const containerDiv = document.createElement("div");
  containerDiv.className = "bg-gray-100 p-8";

  const wrapDiv = document.createElement("div");
  wrapDiv.className = "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";

  const cartH1 = document.createElement("h1");
  cartH1.className = "text-2xl font-bold mb-4";
  cartH1.textContent = "장바구니";

  const cartDiv = document.createElement("div");
  cartDiv.id = "cart-items";

  const totalDiv = document.createElement("div");
  totalDiv.id = "cart-total";
  totalDiv.className = "text-xl font-bold my-4";

  const selects = document.createElement("select");
  selects.id = "product-select";
  selects.className = "border rounded p-2 mr-2";

  const addBtn = document.createElement("button");
  addBtn.id = "add-to-cart";
  addBtn.className = "bg-blue-500 text-white px-4 py-2 rounded";
  addBtn.textContent = "추가";

  const stockInfo = document.createElement("div");
  stockInfo.id = "stock-status";
  stockInfo.className = "text-sm text-gray-500 mt-2";

  // 제품 옵션 렌더링
  renderProductOptions(selects);

  // DOM 구조 구성
  wrapDiv.appendChild(cartH1);
  wrapDiv.appendChild(cartDiv);
  wrapDiv.appendChild(totalDiv);
  wrapDiv.appendChild(selects);
  wrapDiv.appendChild(addBtn);
  wrapDiv.appendChild(stockInfo);

  containerDiv.appendChild(wrapDiv);

  root.appendChild(containerDiv);

  // 장바구니 계산
  calculateCart();

  // 할인 세일 설정
  setUpEvents();
}

// 초기화 및 이벤트 리스너 등록
main();

document.getElementById("add-to-cart").addEventListener("click", handleAddToCart);

document.getElementById("cart-items").addEventListener("click", handleClickCart);
