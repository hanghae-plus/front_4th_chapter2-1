// 전역 변수 선언
var productList,
  productSelect,
  addToCartBtn,
  cartDisplay,
  totalPrice,
  stockStatus;

var lastSelectedProduct,
  bonusPoints = 0,
  totalAmount = 0,
  itemCount = 0;

// 할인 정책 상수
const PROMOTION_CONFIG = {
  FLASH_SALE: {
    INTERVAL: 30000, // 30초
    INITIAL_DELAY: 10000, // 10초
    PROBABILITY: 0.3, // 30% 확률
    DISCOUNT_RATE: 0.8, // 20% 할인 (1 - 0.2)
  },
  RECOMMENDATION: {
    INTERVAL: 60000, // 60초
    INITIAL_DELAY: 20000, // 20초
    DISCOUNT_RATE: 0.95, // 5% 할인 (1 - 0.05)
  },
};
// 상품별 할인율 상수
const PRODUCT_DISCOUNTS = {
  p1: 0.1, // 10% 할인
  p2: 0.15, // 15% 할인
  p3: 0.2, // 20% 할인
  p4: 0.05, // 5% 할인
  p5: 0.25, // 25% 할인
};
// (대량구매) 30개 이상 구매 시 25% 할인
const BULK_PURCHASE_THRESHOLD = 30;
const BULK_PURCHASE_DISCOUNT_RATE = 0.25;

function main() {
  // 상품 목록 초기화
  productList = [
    { id: "p1", name: "상품1", price: 10000, stock: 50 },
    { id: "p2", name: "상품2", price: 20000, stock: 30 },
    { id: "p3", name: "상품3", price: 30000, stock: 20 },
    { id: "p4", name: "상품4", price: 15000, stock: 0 },
    { id: "p5", name: "상품5", price: 25000, stock: 10 },
  ];

  // DOM 요소 생성
  var root = document.getElementById("app");
  let container = document.createElement("div");
  var wrapper = document.createElement("div");
  let headerText = document.createElement("h1");
  cartDisplay = document.createElement("div");
  totalPrice = document.createElement("div");
  productSelect = document.createElement("select");
  addToCartBtn = document.createElement("button");
  stockStatus = document.createElement("div");

  // ID 설정
  cartDisplay.id = "cart-items";
  totalPrice.id = "cart-total";
  productSelect.id = "product-select";
  addToCartBtn.id = "add-to-cart";
  stockStatus.id = "stock-status";

  // 스타일 클래스 설정
  container.className = "bg-gray-100 p-8";
  wrapper.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";
  headerText.className = "text-2xl font-bold mb-4";
  totalPrice.className = "text-xl font-bold my-4";
  productSelect.className = "border rounded p-2 mr-2";
  addToCartBtn.className = "bg-blue-500 text-white px-4 py-2 rounded";
  stockStatus.className = "text-sm text-gray-500 mt-2";

  // 텍스트 콘텐츠 설정
  headerText.textContent = "장바구니";
  addToCartBtn.textContent = "추가";

  updateProductOptions();

  // DOM 구조 구성
  wrapper.appendChild(headerText);
  wrapper.appendChild(cartDisplay);
  wrapper.appendChild(totalPrice);
  wrapper.appendChild(productSelect);
  wrapper.appendChild(addToCartBtn);
  wrapper.appendChild(stockStatus);
  container.appendChild(wrapper);
  root.appendChild(container);

  processCartChanges();

  // 번개세일 타이머
  setTimeout(function () {
    setInterval(function () {
      var luckyItem =
        productList[Math.floor(Math.random() * productList.length)];

      if (
        Math.random() < PROMOTION_CONFIG.FLASH_SALE.PROBABILITY &&
        luckyItem.stock > 0
      ) {
        luckyItem.price = Math.round(
          luckyItem.price * PROMOTION_CONFIG.FLASH_SALE.DISCOUNT_RATE
        );
        alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
        updateProductOptions();
      }
    }, PROMOTION_CONFIG.FLASH_SALE.INTERVAL);
  }, Math.random() * PROMOTION_CONFIG.FLASH_SALE.INITIAL_DELAY);

  // 추천 상품 타이머
  // 추천 상품 타이머
  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedProduct) {
        var suggest = productList.find(function (item) {
          return item.id !== lastSelectedProduct && item.stock > 0;
        });

        if (suggest) {
          alert(
            suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!"
          );
          suggest.price = Math.round(
            suggest.price * PROMOTION_CONFIG.RECOMMENDATION.DISCOUNT_RATE
          );
          updateProductOptions();
        }
      }
    }, PROMOTION_CONFIG.RECOMMENDATION.INTERVAL);
  }, Math.random() * PROMOTION_CONFIG.RECOMMENDATION.INITIAL_DELAY);
}

// 상품 선택 옵션 업데이트
function updateProductOptions() {
  productSelect.innerHTML = "";

  productList.forEach(function (item) {
    var optionElement = document.createElement("option");
    optionElement.value = item.id;
    optionElement.textContent = item.name + " - " + item.price + "원";

    if (item.stock === 0) optionElement.disabled = true;

    productSelect.appendChild(optionElement);
  });
}

// 장바구니 변경사항 처리 (총액 계산, 할인 적용, 보너스 포인트 계산, 재고 상태 업데이트)
function processCartChanges() {
  totalAmount = 0;
  itemCount = 0;
  var cartItems = cartDisplay.children;
  var subTot = 0;

  // 아이템 별 계산 로직
  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      var curItem;
      for (var j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          curItem = productList[j];
          break;
        }
      }

      var quantity = parseInt(
        cartItems[i].querySelector("span").textContent.split("x ")[1]
      );
      var itemTot = curItem.price * quantity;
      var discount = 0;

      itemCount += quantity;
      subTot += itemTot;

      // 할인 적용
      if (quantity >= 10) {
        discount = PRODUCT_DISCOUNTS[curItem.id] || 0;
      }

      totalAmount += itemTot * (1 - discount);
    })();
  }

  // 대량 구매 할인 적용
  let discRate = 0;

  // 30개 이상 구매 시 25% 할인
  if (itemCount >= BULK_PURCHASE_THRESHOLD) {
    var bulkDisc = totalAmount * BULK_PURCHASE_DISCOUNT_RATE;

    var itemDisc = subTot - totalAmount;

    if (bulkDisc > itemDisc) {
      totalAmount = subTot * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (subTot - totalAmount) / subTot;
    }
  } else {
    discRate = (subTot - totalAmount) / subTot;
  }

  // 화요일 10% 할인
  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }

  // 총액 표시
  totalPrice.textContent = "총액: " + Math.round(totalAmount) + "원";

  // 할인 적용 표시
  if (discRate > 0) {
    var span = document.createElement("span");

    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discRate * 100).toFixed(1) + "% 할인 적용)";
    totalPrice.appendChild(span);
  }

  updateStockStatus();
  renderBonusPoints();
}

// 보너스 포인트 표시
const renderBonusPoints = () => {
  bonusPoints = Math.floor(totalAmount / 1000);
  var pointsTag = document.getElementById("loyalty-points");

  if (!pointsTag) {
    pointsTag = document.createElement("span");
    pointsTag.id = "loyalty-points";
    pointsTag.className = "text-blue-500 ml-2";
    totalPrice.appendChild(pointsTag);
  }

  pointsTag.textContent = "(포인트: " + bonusPoints + ")";
};

// 재고 상태 업데이트
function updateStockStatus() {
  var infoMsg = "";
  const LOW_STOCK_THRESHOLD = 5;

  productList.forEach(function (item) {
    if (item.stock < LOW_STOCK_THRESHOLD) {
      infoMsg +=
        item.name +
        ": " +
        (item.stock > 0 ? "재고 부족 (" + item.stock + "개 남음)" : "품절") +
        "\n";
    }
  });

  stockStatus.textContent = infoMsg;
}

main();

// 장바구니 추가 버튼 이벤트
addToCartBtn.addEventListener("click", function () {
  var selectedProductId = productSelect.value;
  var productToAdd = productList.find(function (p) {
    return p.id === selectedProductId;
  });

  if (productToAdd && productToAdd.stock > 0) {
    var item = document.getElementById(productToAdd.id);

    if (item) {
      var newQuantity =
        parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;

      if (newQuantity <= productToAdd.stock) {
        item.querySelector("span").textContent =
          productToAdd.name +
          " - " +
          productToAdd.price +
          "원 x " +
          newQuantity;
        productToAdd.stock--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      var newItem = document.createElement("div");
      newItem.id = productToAdd.id;
      newItem.className = "flex justify-between items-center mb-2";
      newItem.innerHTML =
        "<span>" +
        productToAdd.name +
        " - " +
        productToAdd.price +
        "원 x 1</span><div>" +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        productToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        productToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        productToAdd.id +
        '">삭제</button></div>';

      cartDisplay.appendChild(newItem);
      productToAdd.stock--;
    }

    processCartChanges();
    lastSelectedProduct = selectedProductId;
  }
});

// 장바구니 수량 변경 및 삭제 이벤트
cartDisplay.addEventListener("click", function (event) {
  var target = event.target;

  // 관련 없는 이벤트 무시
  if (
    !target.classList.contains("quantity-change") &&
    !target.classList.contains("remove-item")
  ) {
    return;
  }

  var prodId = target.dataset.productId;
  var itemElem = document.getElementById(prodId);
  var prod = productList.find(function (p) {
    return p.id === prodId;
  });

  // 수량 변경
  if (target.classList.contains("quantity-change")) {
    var qtyChange = parseInt(target.dataset.change);
    var newQuantity =
      parseInt(itemElem.querySelector("span").textContent.split("x ")[1]) +
      qtyChange;

    if (
      newQuantity > 0 &&
      newQuantity <=
        prod.stock +
          parseInt(itemElem.querySelector("span").textContent.split("x ")[1])
    ) {
      itemElem.querySelector("span").textContent =
        itemElem.querySelector("span").textContent.split("x ")[0] +
        "x " +
        newQuantity;
      prod.stock -= qtyChange;
    } else if (newQuantity <= 0) {
      itemElem.remove();
      prod.stock -= qtyChange;
    } else {
      alert("재고가 부족합니다.");
    }
  }
  // 삭제 처리
  else if (target.classList.contains("remove-item")) {
    var removedQuantity = parseInt(
      itemElem.querySelector("span").textContent.split("x ")[1]
    );

    prod.stock += removedQuantity;
    itemElem.remove();
  }

  processCartChanges();
});
