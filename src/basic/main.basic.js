var prodList, sel, addBtn, cartDisp, sum, stockInfo;
var lastSel,
  bonusPts = 0,
  totalAmt = 0,
  itemCnt = 0;

// 아이템
prodList = [
  { id: "p1", name: "상품1", price: 10000, count: 50 },
  { id: "p2", name: "상품2", price: 20000, count: 30 },
  { id: "p3", name: "상품3", price: 30000, count: 20 },
  { id: "p4", name: "상품4", price: 15000, count: 0 },
  { id: "p5", name: "상품5", price: 25000, count: 10 },
];

function main() {
  var root = document.getElementById("app");
  let cont = document.createElement("div");
  var wrap = document.createElement("div");
  let hTxt = document.createElement("h1");

  cartDisp = document.createElement("div");
  cartDisp.id = "cart-items";
  wrap.appendChild(cartDisp);

  sum = document.createElement("div");
  sum.id = "cart-total";
  sum.className = "text-xl font-bold my-4";
  wrap.appendChild(sum);

  sel = document.createElement("select");
  sel.id = "product-select";
  sel.className = "border rounded p-2 mr-2";
  wrap.appendChild(sel);

  addBtn = document.createElement("button");
  addBtn.id = "add-to-cart";
  addBtn.className = "bg-blue-500 text-white px-4 py-2 rounded";
  addBtn.textContent = "추가";
  wrap.appendChild(addBtn);

  stockInfo = document.createElement("div");
  stockInfo.id = "stock-status";
  stockInfo.className = "text-sm text-gray-500 mt-2";
  wrap.appendChild(stockInfo);

  cont.className = "bg-gray-100 p-8";
  cont.appendChild(wrap);
  root.appendChild(cont);

  wrap.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";
  hTxt.className = "text-2xl font-bold mb-4";

  hTxt.textContent = "장바구니";
  wrap.appendChild(hTxt);

  updateSelOpts();

  calcCart();

  setTimeout(function () {
    setInterval(function () {
      var luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
      if (Math.random() < 0.3 && luckyItem.count > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
        updateSelOpts();
      }
    }, 30000);
  }, Math.random() * 10000);
  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        var suggest = prodList.find(function (item) {
          return item.id !== lastSel && item.count > 0;
        });
        if (suggest) {
          alert(
            suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!"
          );
          suggest.price = Math.round(suggest.price * 0.95);
          updateSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
} // main

function updateSelOpts() {
  sel.innerHTML = "";
  prodList.forEach((item) => {
    var opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = item.name + " - " + item.price + "원";
    if (item.count === 0) opt.disabled = true;
    sel.appendChild(opt);
  });
}

function calcCart() {
  totalAmt = 0;
  itemCnt = 0;

  var cartItems = cartDisp.children;
  var subTot = 0;

  for (var i = 0; i < cartItems.length; i++) {
    (() => {
      var curItem;
      for (var j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }

      var q = parseInt(
        cartItems[i].querySelector("span").textContent.split("x ")[1]
      );

      var itemTot = curItem.price * q;
      var disc = 0;

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
    })();
  }

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
  }

  if (new Date().getDay() === 2) {
    totalAmt *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }

  sum.textContent = "총액: " + Math.round(totalAmt) + "원";

  if (discRate > 0) {
    var span = document.createElement("span");
    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discRate * 100).toFixed(1) + "% 할인 적용)";
    sum.appendChild(span);
  }

  updateStockInfo();
  renderBonusPts();
}

const renderBonusPts = () => {
  bonusPts = Math.floor(totalAmt / 1000);

  var ptsTag = document.getElementById("loyalty-points");

  if (!ptsTag) {
    ptsTag = document.createElement("span");
    ptsTag.id = "loyalty-points";
    ptsTag.className = "text-blue-500 ml-2";
    sum.appendChild(ptsTag);
  }

  ptsTag.textContent = "(포인트: " + bonusPts + ")";
};

function updateStockInfo() {
  var infoMsg = "";

  prodList.forEach(function (item) {
    if (item.count < 5) {
      infoMsg += `${item.name}: ${
        item.count > 0 ? `재고 부족 (${item.count}개 남음)` : "품절"
      }\n`;
    }
  });
  stockInfo.textContent = infoMsg;
}

main();

addBtn.addEventListener("click", function () {
  var selItem = sel.value;
  var itemToAdd = prodList.find(function (p) {
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
      cartDisp.appendChild(newItem);
      itemToAdd.count--;
    }
    calcCart();
    lastSel = selItem;
  }
});

cartDisp.addEventListener("click", function (event) {
  var tgt = event.target;
  if (
    tgt.classList.contains("quantity-change") ||
    tgt.classList.contains("remove-item")
  ) {
    var prodId = tgt.dataset.productId;
    var itemElem = document.getElementById(prodId);
    var prod = prodList.find(function (p) {
      return p.id === prodId;
    });
    if (tgt.classList.contains("quantity-change")) {
      var qtyChange = parseInt(tgt.dataset.change);
      var newQty =
        parseInt(itemElem.querySelector("span").textContent.split("x ")[1]) +
        qtyChange;
      if (
        newQty > 0 &&
        newQty <=
          prod.count +
            parseInt(itemElem.querySelector("span").textContent.split("x ")[1])
      ) {
        itemElem.querySelector("span").textContent =
          itemElem.querySelector("span").textContent.split("x ")[0] +
          "x " +
          newQty;
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
