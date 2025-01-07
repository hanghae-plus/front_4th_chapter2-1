var productList, select, addButton, cartDisplay, sum, stockInfo;

var lastSell,
  bonusPoints = 0,
  totalAmount = 0,
  itemCounts = 0;

function main() {
  var root = document.getElementById("app");

  let cont = document.createElement("div");
  cont.className = "bg-gray-100 p-8";

  var wrap = document.createElement("div");
  wrap.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";

  let hText = document.createElement("h1");
  hText.className = "text-2xl font-bold mb-4";
  hText.textContent = "장바구니";

  cartDisplay = document.createElement("div");
  cartDisplay.id = "cart-items";

  sum = document.createElement("div");
  sum.id = "cart-total";
  sum.className = "text-xl font-bold my-4";

  select = document.createElement("select");
  select.id = "product-select";
  select.className = "border rounded p-2 mr-2";

  addButton = document.createElement("button");
  addButton.id = "add-to-cart";
  addButton.className = "bg-blue-500 text-white px-4 py-2 rounded";
  addButton.textContent = "추가";

  stockInfo = document.createElement("div");
  stockInfo.id = "stock-status";
  stockInfo.className = "text-sm text-gray-500 mt-2";

  updateSelectOptions();

  wrap.appendChild(hText);
  wrap.appendChild(cartDisplay);
  wrap.appendChild(sum);
  wrap.appendChild(select);
  wrap.appendChild(addButton);
  wrap.appendChild(stockInfo);
  cont.appendChild(wrap);
  root.appendChild(cont);

  calcCart();

  // 번개세일 할인 이벤트
  setTimeout(function () {
    setInterval(function () {
      var luckyItem =
        productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && 0 < luckyItem.quantity) {
        luckyItem.value = Math.round(luckyItem.value * 0.8);
        alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
        updateSelectOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  // 추천상품 할인 이베트
  setTimeout(function () {
    setInterval(function () {
      if (lastSell) {
        var suggest = productList.find(function (item) {
          return item.id !== lastSell && 0 < item.quantity;
        });
        if (suggest) {
          alert(
            suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!"
          );
          suggest.value = Math.round(suggest.value * 0.95);
          updateSelectOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

// 상품 업데이트
function updateSelectOptions() {
  select.innerHTML = "";
  productList.forEach(function (item) {
    var option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name + " - " + item.value + "원";

    if (item.quantity === 0) {
      option.disabled = true;
    }

    select.appendChild(option);
  });
}

// 장바구니 계산
function calcCart() {
  totalAmount = 0;
  itemCounts = 0;

  var cartItems = cartDisplay.children;
  var subTotal = 0;

  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      var currentItem;
      for (var j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          currentItem = productList[j];
          break;
        }
      }

      var quantity = parseInt(
        cartItems[i].querySelector("span").textContent.split("x ")[1]
      );
      var itemTotal = currentItem.value * quantity;
      var discount = 0;

      itemCounts += quantity;
      subTotal += itemTotal;

      if (quantity >= 10) {
        if (currentItem.id === "p1") discount = 0.1;
        else if (currentItem.id === "p2") discount = 0.15;
        else if (currentItem.id === "p3") discount = 0.2;
        else if (currentItem.id === "p4") discount = 0.05;
        else if (currentItem.id === "p5") discount = 0.25;
      }

      totalAmount += itemTotal * (1 - discount);
    })();
  }

  let discountRate = 0;

  // 30개 이상 구매: 대량구매 25% 할인
  if (itemCounts >= 30) {
    var bulkDiscount = totalAmount * 0.25;
    var itemDiscount = subTotal - totalAmount;

    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotal * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subTotal - totalAmount) / subTotal;
    }
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  // 화요일(2)이면 10% 할인
  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  sum.textContent = "총액: " + Math.round(totalAmount) + "원";

  if (discountRate > 0) {
    var span = document.createElement("span");
    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discountRate * 100).toFixed(1) + "% 할인 적용)";
    sum.appendChild(span);
  }

  updateStockInfo();
  renderBonusPts();
}

// 포인트 계산
const renderBonusPts = () => {
  bonusPoints = Math.floor(totalAmount / 1000);

  var pointsTag = document.getElementById("loyalty-points");
  if (!pointsTag) {
    pointsTag = document.createElement("span");
    pointsTag.id = "loyalty-points";
    pointsTag.className = "text-blue-500 ml-2";
    sum.appendChild(pointsTag);
  }
  pointsTag.textContent = "(포인트: " + bonusPoints + ")";
};

// 재고 정보 업데이트
function updateStockInfo() {
  var infoMessage = "";
  productList.forEach(function (item) {
    if (item.quantity < 5) {
      infoMessage +=
        item.name +
        ": " +
        (item.quantity > 0
          ? "재고 부족 (" + item.quantity + "개 남음)"
          : "품절") +
        "\n";
    }
  });
  stockInfo.textContent = infoMessage;
}

main();

// addButton 클릭시 이벤트 등록
addButton.addEventListener("click", function () {
  var selectedItem = select.value;
  var itemToAdd = productList.find(function (p) {
    return p.id === selectedItem;
  });

  if (itemToAdd && itemToAdd.quantity > 0) {
    var item = document.getElementById(itemToAdd.id);

    if (item) {
      var newQuantity =
        parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;

      if (newQuantity <= itemToAdd.quantity) {
        item.querySelector("span").textContent =
          itemToAdd.name + " - " + itemToAdd.value + "원 x " + newQuantity;
        itemToAdd.quantity--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      var newItem = document.createElement("div");
      newItem.id = itemToAdd.id;
      newItem.className = "flex justify-between items-center mb-2";
      newItem.innerHTML =
        "<span>" +
        itemToAdd.name +
        " - " +
        itemToAdd.value +
        "원 x 1</span><div>" +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>';

      cartDisplay.appendChild(newItem);

      itemToAdd.quantity--;
    }

    calcCart();

    lastSell = selItem;
  }
});

// cartDisplay 클릭시 이벤트 등록
cartDisplay.addEventListener("click", function (event) {
  var target = event.target;
  if (
    target.classList.contains("quantity-change") ||
    target.classList.contains("remove-item")
  ) {
    var productId = target.dataset.productId;
    var itemElement = document.getElementById(productId);
    var product = productList.find(function (p) {
      return p.id === productId;
    });

    if (target.classList.contains("quantity-change")) {
      var quantityChange = parseInt(target.dataset.change);
      var newQuantity =
        parseInt(itemElement.querySelector("span").textContent.split("x ")[1]) +
        quantityChange;

      if (
        newQuantity > 0 &&
        newQuantity <=
          product.quantity +
            parseInt(
              itemElement.querySelector("span").textContent.split("x ")[1]
            )
      ) {
        itemElement.querySelector("span").textContent =
          itemElement.querySelector("span").textContent.split("x ")[0] +
          "x " +
          newQuantity;
        product.quantity -= quantityChange;
      } else if (newQuantity <= 0) {
        itemElement.remove();
        product.quantity -= quantityChange;
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (target.classList.contains("remove-item")) {
      var removeQuantity = parseInt(
        itemElement.querySelector("span").textContent.split("x ")[1]
      );
      product.quantity += removeQuantity;
      itemElement.remove();
    }

    calcCart();
  }
});
