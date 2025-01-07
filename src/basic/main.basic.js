import { DISCOUNTS, BULK_DISCOUNT, SPETIAL_DISCOUNT } from "./constants/cart";
import { WEEKDAY } from "./constants/common";

let productList,
  selectedProduct,
  addToCartButton,
  cartDisplay,
  totalAmountDisplay,
  stockInfoDisplay;

let lastSelectedProduct,
  bonusPoints = 0,
  totalAmount = 0,
  itemCount = 0;

function main() {
  productList = [
    { id: "p1", name: "상품1", value: 10000, quantity: 50 },
    { id: "p2", name: "상품2", value: 20000, quantity: 30 },
    { id: "p3", name: "상품3", value: 30000, quantity: 20 },
    { id: "p4", name: "상품4", value: 15000, quantity: 0 },
    { id: "p5", name: "상품5", value: 25000, quantity: 10 },
  ];

  // DOM 요소들 생성
  const root = document.getElementById("app");
  const container = document.createElement("div");
  const wrapper = document.createElement("div");
  const headingText = document.createElement("h1");
  cartDisplay = document.createElement("div");
  totalAmountDisplay = document.createElement("div");
  selectedProduct = document.createElement("select");
  addToCartButton = document.createElement("button");
  stockInfoDisplay = document.createElement("div");

  // 생성된 DOM 요소들에 ID 및 클래스 추가
  cartDisplay.id = "cart-items";
  totalAmountDisplay.id = "cart-total";
  selectedProduct.id = "product-select";
  addToCartButton.id = "add-to-cart";
  stockInfoDisplay.id = "stock-status";

  container.className = "bg-gray-100 p-8";
  wrapper.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";
  headingText.className = "text-2xl font-bold mb-4";
  totalAmountDisplay.className = "text-xl font-bold my-4";
  selectedProduct.className = "border rounded p-2 mr-2";
  addToCartButton.className = "bg-blue-500 text-white px-4 py-2 rounded";
  stockInfoDisplay.className = "text-sm text-gray-500 mt-2";

  // 텍스트 콘텐츠 설정
  headingText.textContent = "장바구니";
  addToCartButton.textContent = "추가";

  // 제품 선택 옵션 업데이트
  updateProductSelectOptions();

  // DOM 트리 구성
  wrapper.appendChild(headingText);
  wrapper.appendChild(cartDisplay);
  wrapper.appendChild(totalAmountDisplay);
  wrapper.appendChild(selectedProduct);
  wrapper.appendChild(addToCartButton);
  wrapper.appendChild(stockInfoDisplay);

  container.appendChild(wrapper);
  root.appendChild(container);

  calculateCart();

  // 번개세일: 랜덤 시간마다 20% 할인 적용
  setTimeout(function () {
    setInterval(function () {
      const luckyItem =
        productList[Math.floor(Math.random() * productList.length)];

      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.value = Math.round(luckyItem.value * SPETIAL_DISCOUNT.LUCKY);
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        updateProductSelectOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  // 추천 상품: 랜덤 시간마다 5% 추가 할인 적용
  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedProduct) {
        const suggestedItem = productList.find(function (item) {
          return item.id !== lastSelectedProduct && item.quantity > 0;
        });

        if (suggestedItem) {
          alert(
            `${suggestedItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
          );
          suggestedItem.value = Math.round(
            suggestedItem.value * SPETIAL_DISCOUNT.SUGGESTED,
          );
          updateProductSelectOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

// 제품 선택 옵션 업데이트
function updateProductSelectOptions() {
  selectedProduct.innerHTML = ""; // 기존 옵션 제거
  productList.forEach(function (item) {
    const optionElement = document.createElement("option");
    optionElement.value = item.id;
    optionElement.textContent = `${item.name} - ${item.value}원`;

    // 품절된 제품 비활성화
    if (item.quantity === 0) {
      optionElement.disabled = true;
    }

    selectedProduct.appendChild(optionElement);
  });
}

// 장바구니 계산
function calculateCart() {
  totalAmount = 0;
  itemCount = 0;
  const cartItems = cartDisplay.children;
  let subTotal = 0;

  // 장바구니 아이템들 반복 처리
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let currentItem;

      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          currentItem = productList[j];
          break;
        }
      }

      const quantity = parseInt(
        cartItems[i].querySelector("span").textContent.split("x ")[1],
      );
      const itemTotal = currentItem.value * quantity;
      let discount = 0;
      itemCount += quantity;
      subTotal += itemTotal;

      // 상품별 수량 할인 적용
      if (quantity >= 10) {
        if (currentItem.id === "p1") discount = DISCOUNTS.RATE_10;
        else if (currentItem.id === "p2") discount = DISCOUNTS.RATE_15;
        else if (currentItem.id === "p3") discount = DISCOUNTS.RATE_20;
        else if (currentItem.id === "p4") discount = DISCOUNTS.RATE_5;
        else if (currentItem.id === "p5") discount = DISCOUNTS.RATE_25;
      }

      totalAmount += itemTotal * (1 - discount);
    })();
  }

  // 대량 구매 할인 적용
  let discountRate = 0;
  if (itemCount >= BULK_DISCOUNT.THRESHOLD) {
    const bulkDiscount = totalAmount * BULK_DISCOUNT.RATE;
    const itemDiscount = subTotal - totalAmount;

    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotal * (1 - BULK_DISCOUNT.RATE);
      discountRate = BULK_DISCOUNT.RATE;
    } else {
      discountRate = (subTotal - totalAmount) / subTotal;
    }
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  // 화요일에는 추가 10% 할인 적용
  if (new Date().getDay() === WEEKDAY.TUESDAY) {
    totalAmount *= 1 - DISCOUNTS.RATE_10;
    discountRate = Math.max(discountRate, DISCOUNTS.RATE_10);
  }

  // 총액 표시
  totalAmountDisplay.textContent = `총액: ${Math.round(totalAmount)}원`;

  // 할인율 표시
  if (discountRate > 0) {
    const discountSpan = document.createElement("span");

    discountSpan.className = "text-green-500 ml-2";
    discountSpan.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
    totalAmountDisplay.appendChild(discountSpan);
  }

  // 재고 정보 업데이트
  updateStockInfo();
  renderBonusPoints();
}

// 포인트 표시
const renderBonusPoints = () => {
  bonusPoints = Math.floor(totalAmount / 1000);
  let pointsTag = document.getElementById("loyalty-points");

  if (!pointsTag) {
    pointsTag = document.createElement("span");
    pointsTag.id = "loyalty-points";
    pointsTag.className = "text-blue-500 ml-2";
    totalAmountDisplay.appendChild(pointsTag);
  }

  pointsTag.textContent = `(포인트: ${bonusPoints})`;
};

// 재고 상태 업데이트
function updateStockInfo() {
  let infoMessage = "";
  productList.forEach(function (item) {
    if (item.quantity < 5) {
      infoMessage += `${item.name}: ${item.quantity > 0 ? `재고 부족 (${item.quantity}개 남음)` : "품절"}\n`;
    }
  });
  stockInfoDisplay.textContent = infoMessage;
}

// 초기화 실행
main();

// 장바구니에 제품 추가 이벤트 처리
addToCartButton.addEventListener("click", function () {
  const selectedItem = selectedProduct.value;
  const itemToAdd = productList.find(function (product) {
    return product.id === selectedItem;
  });

  if (itemToAdd && itemToAdd.quantity > 0) {
    let itemElement = document.getElementById(itemToAdd.id);

    // 이미 장바구니에 있는 경우 수량 업데이트
    if (itemElement) {
      const newQuantity =
        parseInt(itemElement.querySelector("span").textContent.split("x ")[1]) +
        1;

      if (newQuantity <= itemToAdd.quantity) {
        itemElement.querySelector("span").textContent =
          `${itemToAdd.name} - ${itemToAdd.value}원 x ${newQuantity}`;
        itemToAdd.quantity--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      // 새 항목 추가
      const newItemElement = document.createElement("div");
      newItemElement.id = itemToAdd.id;
      newItemElement.className = "flex justify-between items-center mb-2";
      newItemElement.innerHTML = `
        <span>${itemToAdd.name} - ${itemToAdd.value}원 x 1</span><div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
        </div>
      `;

      cartDisplay.appendChild(newItemElement);
      itemToAdd.quantity--;
    }

    calculateCart();
    lastSelectedProduct = selectedItem;
  }
});

// 장바구니 항목 클릭 이벤트 처리 (수량 변경 및 삭제)
cartDisplay.addEventListener("click", function (event) {
  const targetElement = event.target;

  if (
    targetElement.classList.contains("quantity-change") ||
    targetElement.classList.contains("remove-item")
  ) {
    const productId = targetElement.dataset.productId;
    const itemElement = document.getElementById(productId);
    const product = productList.find(function (product) {
      return product.id === productId;
    });

    // 수량 변경 처리
    if (targetElement.classList.contains("quantity-change")) {
      const quantityChange = parseInt(targetElement.dataset.change);
      const newQuantity =
        parseInt(itemElement.querySelector("span").textContent.split("x ")[1]) +
        quantityChange;

      if (
        newQuantity > 0 &&
        newQuantity <=
          product.quantity +
            parseInt(
              itemElement.querySelector("span").textContent.split("x ")[1],
            )
      ) {
        itemElement.querySelector("span").textContent =
          `${itemElement.querySelector("span").textContent.split("x ")[0]}x ${newQuantity}`;
        product.quantity -= quantityChange;
      } else if (newQuantity <= 0) {
        itemElement.remove();
        product.quantity -= quantityChange;
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (targetElement.classList.contains("remove-item")) {
      const removedQuantity = parseInt(
        itemElement.querySelector("span").textContent.split("x ")[1],
      );

      product.quantity += removedQuantity;
      itemElement.remove();
    }

    calculateCart();
  }
});
