let sel, addBtn, cartDisp, sum, stockInfo;
let lastSel,
  totalPrice = 0,
  itemCnt = 0;

const productList = [
  { id: "p1", name: "상품1", price: 10000, remaining: 50 },
  { id: "p2", name: "상품2", price: 20000, remaining: 30 },
  { id: "p3", name: "상품3", price: 30000, remaining: 20 },
  { id: "p4", name: "상품4", price: 15000, remaining: 0 },
  { id: "p5", name: "상품5", price: 25000, remaining: 10 },
];

// 적립 포인트
const renderLoyaltyPoints = () => {
  let loyaltyPoints = Math.floor(totalPrice / 1000);
  let points = document.getElementById("loyalty-points");

  if (!points) {
    points = document.createElement("span");
    points.id = "loyalty-points";
    points.className = "text-blue-500 ml-2";
    sum.appendChild(points);
  }

  points.textContent = "(포인트: " + loyaltyPoints + ")";
};

// 콤보박스
function updateSelOpts() {
  sel.innerHTML = "";

  productList.forEach(function (item) {
    let opt = document.createElement("option");

    opt.value = item.id;
    opt.textContent = item.name + " - " + item.price + "원";

    if (item.remaining === 0) opt.disabled = true;

    sel.appendChild(opt);
  });
}

// 재고 메시지
function updateStockInfo() {
  let infoMsg = "";

  productList.forEach(function (item) {
    if (item.remaining < 5) {
      infoMsg += item.name + ": " + (item.remaining > 0 ? "재고 부족 (" + item.remaining + "개 남음)" : "품절") + "\n";
    }
  });

  stockInfo.textContent = infoMsg;
}

// 장바구니 계산
function handleCalcCart() {
  totalPrice = 0;
  itemCnt = 0;

  let cartItems = cartDisp.children;
  let subTot = 0;

  for (let i = 0; i < cartItems.length; i++) {
    (function () {
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

      totalPrice += itemTot * (1 - disc);
    })();
  }

  let discRate = 0;

  if (itemCnt >= 30) {
    let bulkDisc = totalPrice * 0.25;
    let itemDisc = subTot - totalPrice;

    if (bulkDisc > itemDisc) {
      totalPrice = subTot * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (subTot - totalPrice) / subTot;
    }
  } else {
    discRate = (subTot - totalPrice) / subTot;
  }

  if (new Date().getDay() === 2) {
    totalPrice *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }

  sum.textContent = "총액: " + Math.round(totalPrice) + "원";

  if (discRate > 0) {
    let span = document.createElement("span");

    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discRate * 100).toFixed(1) + "% 할인 적용)";

    sum.appendChild(span);
  }

  updateStockInfo();

  renderLoyaltyPoints();
}

function main() {
  let root = document.getElementById("app");
  let cont = document.createElement("div");
  let wrap = document.createElement("div");
  let hTxt = document.createElement("h1");

  cartDisp = document.createElement("div");
  sum = document.createElement("div");
  sel = document.createElement("select");
  addBtn = document.createElement("button");
  stockInfo = document.createElement("div");

  cartDisp.id = "cart-items";
  sum.id = "cart-total";
  sel.id = "product-select";
  addBtn.id = "add-to-cart";
  stockInfo.id = "stock-status";

  cont.className = "bg-gray-100 p-8";
  wrap.className = "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";
  hTxt.className = "text-2xl font-bold mb-4";
  sum.className = "text-xl font-bold my-4";
  sel.className = "border rounded p-2 mr-2";
  addBtn.className = "bg-blue-500 text-white px-4 py-2 rounded";
  stockInfo.className = "text-sm text-gray-500 mt-2";

  hTxt.textContent = "장바구니";
  addBtn.textContent = "추가";

  updateSelOpts();

  wrap.appendChild(hTxt);
  wrap.appendChild(cartDisp);
  wrap.appendChild(sum);
  wrap.appendChild(sel);
  wrap.appendChild(addBtn);
  wrap.appendChild(stockInfo);
  cont.appendChild(wrap);
  root.appendChild(cont);

  handleCalcCart();

  // 할인 이벤트 알럿 1
  setTimeout(function () {
    setInterval(function () {
      let luckyItem = productList[Math.floor(Math.random() * productList.length)];

      if (Math.random() < 0.3 && luckyItem.remaining > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);

        alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");

        updateSelOpts();
      }
    }, 30000);
  }, Math.random() * 10000);

  // 할인 이벤트 알럿 2
  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        let suggest = productList.find(function (item) {
          return item.id !== lastSel && item.remaining > 0;
        });

        if (suggest) {
          alert(suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!");
          suggest.price = Math.round(suggest.price * 0.95);
          updateSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

main();

addBtn.addEventListener("click", function () {
  let selItem = sel.value;
  let itemToAdd = productList.find(function (p) {
    return p.id === selItem;
  });

  if (itemToAdd && itemToAdd.remaining > 0) {
    let item = document.getElementById(itemToAdd.id);

    if (item) {
      let newQty = parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;

      if (newQty <= itemToAdd.remaining) {
        item.querySelector("span").textContent = itemToAdd.name + " - " + itemToAdd.price + "원 x " + newQty;
        itemToAdd.remaining--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      let newItem = document.createElement("div");

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

      itemToAdd.remaining--;
    }
    handleCalcCart();

    lastSel = selItem;
  }
});

cartDisp.addEventListener("click", function (event) {
  let tgt = event.target;

  if (tgt.classList.contains("quantity-change") || tgt.classList.contains("remove-item")) {
    let prodId = tgt.dataset.productId;
    let itemElem = document.getElementById(prodId);
    let prod = productList.find(function (p) {
      return p.id === prodId;
    });

    if (tgt.classList.contains("quantity-change")) {
      let qtyChange = parseInt(tgt.dataset.change);
      let newQty = parseInt(itemElem.querySelector("span").textContent.split("x ")[1]) + qtyChange;

      if (newQty > 0 && newQty <= prod.remaining + parseInt(itemElem.querySelector("span").textContent.split("x ")[1])) {
        itemElem.querySelector("span").textContent = itemElem.querySelector("span").textContent.split("x ")[0] + "x " + newQty;

        prod.remaining -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();

        prod.remaining -= qtyChange;
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (tgt.classList.contains("remove-item")) {
      let remQty = parseInt(itemElem.querySelector("span").textContent.split("x ")[1]);

      prod.remaining += remQty;

      itemElem.remove();
    }

    handleCalcCart();
  }
});
