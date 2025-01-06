var productList, productSelectBox, cartAddBtn, cartList, cartTotal, stockStatus;
var lastSel,
  bonusPts = 0,
  totalAmt = 0,
  itemCnt = 0;

// 아이템
productList = [
  { id: "p1", name: "상품1", price: 10000, count: 50 },
  { id: "p2", name: "상품2", price: 20000, count: 30 },
  { id: "p3", name: "상품3", price: 30000, count: 20 },
  { id: "p4", name: "상품4", price: 15000, count: 0 },
  { id: "p5", name: "상품5", price: 25000, count: 10 },
];

// 요소 생성 함수
function createElement(tag, options = {}) {
  const element = document.createElement(tag);
  if (options.id) element.id = options.id;
  if (options.className) element.className = options.className;
  if (options.textContent) element.textContent = options.textContent;
  if (options.value) element.value = options.value;
  return element;
}

function getluckyItem() {
  return productList[Math.floor(Math.random() * productList.length)];
}

function findSuggest() {
  return productList.find((item) => item.id !== lastSel && item.count > 0);
}

function main() {
  const root = document.getElementById("app");
  let cont = createElement("div", { className: "bg-gray-100 p-8" });
  let wrap = createElement("div", { className: "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8" });
  let hTxt = createElement("h1", { className: "text-2xl font-bold mb-4", textContent: "장바구니" });

  cont.appendChild(wrap);
  root.appendChild(cont);
  wrap.appendChild(hTxt);

  cartList = createElement("div", { id: "cart-items" });
  wrap.appendChild(cartList);

  cartTotal = createElement("div", { id: "cart-total", className: "text-xl font-bold my-4" });
  wrap.appendChild(cartTotal);

  productSelectBox = createElement("select", { id: "product-select", className: "border rounded p-2 mr-2" });
  wrap.appendChild(productSelectBox);

  cartAddBtn = createElement("button", { id: "add-to-cart", className: "bg-blue-500 text-white px-4 py-2 rounded", textContent: "추가" });
  wrap.appendChild(cartAddBtn);

  stockStatus = createElement("div", { id: "stock-status", className: "text-sm text-gray-500 mt-2" });
  wrap.appendChild(stockStatus);

  updateSelOpts();
  calcCart();

  setTimeout(() => {
    setInterval(() => {
      let { count, price, name } = getluckyItem();

      if (Math.random() < 0.3 && count > 0) {
        let itemPrice = price * 0.8;
        price = Math.round(itemPrice);
        alert("번개세일! " + name + "이(가) 20% 할인 중입니다!");
        updateSelOpts();
      }

    }, 30000);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(() => {
      let suggest = findSuggest();

      if (suggest) {
        let { price, name } = suggest;
        alert(name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!");
        price = Math.round(price * 0.95);
        updateSelOpts();
      }
    }, 60000);
  }, Math.random() * 20000);
} // main

function updateSelOpts() {
  productSelectBox.innerHTML = "";
  productList.forEach((item) => {
    let opt = createElement("option", { value: item.id, textContent: item.name + " - " + item.price + "원" });

    if (item.count === 0) opt.disabled = true;
    productSelectBox.appendChild(opt);
  });
}

function calcCart() {
  totalAmt = 0;
  itemCnt = 0;

  let cartItems = cartList.children;
  let subTot = 0;

  for (let i = 0; i < cartItems.length; i++) {

    let curItem;

    for (let j = 0; j < productList.length; j++) {
      if (productList[j].id === cartItems[i].id) {
        curItem = productList[j];
        break;
      }
    }

    let q = parseInt(cartItems[i].querySelector("span").textContent.split("x ")[1]);

    let itemTot = curItem.price * q;
    let disc = 0;

    itemCnt += q;
    subTot += itemTot;

    if (q >= 10) {
      if (curItem.id === "p1") disc = 0.1;
      else if (curItem.id === "p2") disc = 0.15;
      else if (curItem.id === "p3") disc = 0.2;
      else if (curItem.id === "p4") disc = 0.05;
      else if (curItem.id === "p5") disc = 0.25;
    }

    totalAmt += itemTot * (1 - disc);

  } // for

  let discRate = 0;

  if (itemCnt >= 30) {
    var bulkDisc = totalAmt * 0.25;
    var itemDisc = subTot - totalAmt;

    if (bulkDisc > itemDisc) {
      totalAmt = subTot * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (subTot - totalAmt) / subTot;
    }
  } else {
    discRate = (subTot - totalAmt) / subTot;
  } // if - else

  if (new Date().getDay() === 2) {
    totalAmt *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }

  cartTotal.textContent = "총액: " + Math.round(totalAmt) + "원";

  if (discRate > 0) {
    var span = document.createElement("span");
    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discRate * 100).toFixed(1) + "% 할인 적용)";
    cartTotal.appendChild(span);
  }

  updateStockInfo();
  renderBonusPts();
} // calcCart

const renderBonusPts = () => {
  bonusPts = Math.floor(totalAmt / 1000);

  var ptsTag = document.getElementById("loyalty-points");

  if (!ptsTag) {
    ptsTag = document.createElement("span");
    ptsTag.id = "loyalty-points";
    ptsTag.className = "text-blue-500 ml-2";
    cartTotal.appendChild(ptsTag);
  }

  ptsTag.textContent = "(포인트: " + bonusPts + ")";
};

function updateStockInfo() {
  var infoMsg = "";

  productList.forEach(function (item) {
    if (item.count < 5) {
      infoMsg += `${item.name}: ${
        item.count > 0 ? `재고 부족 (${item.count}개 남음)` : "품절"
      }\n`;
    }
  });
  stockStatus.textContent = infoMsg;
}

main();

cartAddBtn.addEventListener("click", () => {
  var selItem = productSelectBox.value;
  var itemToAdd = productList.find((p) => {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.count > 0) {

    var item = document.getElementById(itemToAdd.id);

    if (item) {
      var newQty =
        parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;

      if (newQty <= itemToAdd.count) {
        item.querySelector("span").textContent =
          itemToAdd.name + " - " + itemToAdd.price + "원 x " + newQty;
        itemToAdd.count--;
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
        itemToAdd.price +
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

      cartList.appendChild(newItem);
      itemToAdd.count--;
    }

    calcCart();
    lastSel = selItem;
  }
});

cartList.addEventListener("click", function (event) {
  var tgt = event.target;
  if (
    tgt.classList.contains("quantity-change") ||
    tgt.classList.contains("remove-item")
  ) {
    var prodId = tgt.dataset.productId;
    var itemElem = document.getElementById(prodId);

    var prod = productList.find(function (p) {
      return p.id === prodId;
    });
    if (tgt.classList.contains("quantity-change")) {

      var qtyChange = parseInt(tgt.dataset.change);
      var newQty = parseInt(itemElem.querySelector("span").textContent.split("x ")[1]) + qtyChange;

      if (newQty > 0 && newQty <= prod.count + parseInt(itemElem.querySelector("span").textContent.split("x ")[1])) {
        itemElem.querySelector("span").textContent =
          itemElem.querySelector("span").textContent.split("x ")[0] + "x " + newQty;
        prod.count -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.count -= qtyChange;
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (tgt.classList.contains("remove-item")) {
      var remQty = parseInt(
        itemElem.querySelector("span").textContent.split("x ")[1]
      );
      prod.count += remQty;
      itemElem.remove();
    }
    calcCart();
  }
});
