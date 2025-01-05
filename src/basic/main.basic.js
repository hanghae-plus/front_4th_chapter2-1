import { ID_BY_COMPONENT, CURRENCY } from "./const";

import {
  DISC_INITIAL_BUFFERS,
  DISC_INTERVALS,
  DISC_RATES,
  DISC_DAY_OF_THE_WEEK,
  ITEM_DISC_MIN_QTY,
  discountAlertProcessor,
} from "./utils";

const productList = [
  { id: "p1", name: "상품1", val: 10000, qty: 50 },
  { id: "p2", name: "상품2", val: 20000, qty: 30 },
  { id: "p3", name: "상품3", val: 30000, qty: 20 },
  { id: "p4", name: "상품4", val: 15000, qty: 0 },
  { id: "p5", name: "상품5", val: 25000, qty: 10 },
];

let select, addBtn, cart, sum, stockInfo;

let lastSel,
  bonusPts = 0,
  totalPriceWithDisc = 0,
  itemCnt = 0;

function main() {
  const root = document.getElementById("app");
  const contents = document.createElement("div");
  contents.className = "bg-gray-100 p-8";

  const wrap = document.createElement("div");
  wrap.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";

  const wrapTitle = document.createElement("h1");
  wrapTitle.className = "text-2xl font-bold mb-4";
  wrapTitle.textContent = "장바구니";

  cart = document.createElement("div");
  cart.id = ID_BY_COMPONENT.CART_ID;

  sum = document.createElement("div");
  sum.id = ID_BY_COMPONENT.SUM_ID;
  sum.className = "text-xl font-bold my-4";

  select = document.createElement("select");
  select.id = ID_BY_COMPONENT.SELECT_ID;
  select.className = "border rounded p-2 mr-2";

  addBtn = document.createElement("button");
  addBtn.id = ID_BY_COMPONENT.ADD_BTN_ID;
  addBtn.className = "bg-blue-500 text-white px-4 py-2 rounded";
  addBtn.textContent = "추가";

  stockInfo = document.createElement("div");
  stockInfo.id = ID_BY_COMPONENT.STOCK_INFO_ID;
  stockInfo.className = "text-sm text-gray-500 mt-2";

  updateSelectOpts();

  wrap.appendChild(wrapTitle);
  wrap.appendChild(cart);
  wrap.appendChild(sum);
  wrap.appendChild(select);
  wrap.appendChild(addBtn);
  wrap.appendChild(stockInfo);
  contents.appendChild(wrap);
  root.appendChild(contents);

  calcCart();

  setLuckyDiscAlert();
  setAdditionalDiscAlert();
}

const setLuckyDiscAlert = () => {
  setTimeout(function () {
    setInterval(function () {
      const luckyItem =
        productList[Math.floor(Math.random() * productList.length)];
      discountAlertProcessor(luckyItem, "LUCKY_DISC");
    }, DISC_INTERVALS.LUCKY_DISC);
  }, Math.random() * DISC_INITIAL_BUFFERS.LUCKY_DISC);
};

const setAdditionalDiscAlert = () => {
  setTimeout(function () {
    setInterval(function () {
      if (!lastSel) return;
      const suggestedItem = productList.find(function (item) {
        return item.id !== lastSel;
      });
      discountAlertProcessor(suggestedItem, "ADDITIONAL_DISC");
    }, DISC_INTERVALS.ADDITIONAL_DISC);
  }, Math.random() * DISC_INITIAL_BUFFERS.ADDITIONAL_DISC);
};

function updateSelectOpts() {
  select.innerHTML = "";
  productList.forEach(function (item) {
    const opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = `${item.name} - ${item.val}${CURRENCY}`;
    if (item.qty === 0) opt.disabled = true;
    select.appendChild(opt);
  });
}

function calcCart() {
  totalPriceWithDisc = 0;
  itemCnt = 0;

  const cartItems = cart.children;
  let totalPrice = 0;

  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          curItem = productList[j];
          break;
        }
      }
      const qty = parseInt(
        cartItems[i].querySelector("span").textContent.split("x ")[1],
      );
      const itemTotalPrice = curItem.val * qty;
      let disc = 0;
      itemCnt += qty;
      totalPrice += itemTotalPrice;
      if (qty >= ITEM_DISC_MIN_QTY) {
        disc = DISC_RATES.ITEM_DISC[curItem.id];
      }
      totalPriceWithDisc += itemTotalPrice * (1 - disc);
    })();
  }

  let discRate = 0;

  if (itemCnt >= 30) {
    const bulkDisc = totalPriceWithDisc * DISC_RATES.BULK_DISC;
    const itemDisc = totalPrice - totalPriceWithDisc;
    if (bulkDisc > itemDisc) {
      totalPriceWithDisc = totalPrice * (1 - DISC_RATES.BULK_DISC);
      discRate = DISC_RATES.BULK_DISC;
    } else {
      discRate = (totalPrice - totalPriceWithDisc) / totalPrice;
    }
  } else {
    discRate = (totalPrice - totalPriceWithDisc) / totalPrice;
  }

  if (new Date().getDay() === DISC_DAY_OF_THE_WEEK) {
    totalPriceWithDisc *= 1 - DISC_RATES.DAY_OF_THE_WEEK_DISC;
    discRate = Math.max(discRate, DISC_RATES.DAY_OF_THE_WEEK_DISC);
  }

  sum.textContent = "총액: " + Math.round(totalPriceWithDisc) + CURRENCY;

  if (discRate > 0) {
    const span = document.createElement("span");
    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discRate * 100).toFixed(1) + "% 할인 적용)";
    sum.appendChild(span);
  }
  updateStockInfo();
  renderBonusPts();
}

const renderBonusPts = () => {
  bonusPts = Math.floor(totalPriceWithDisc / 1000);
  let ptsTag = document.getElementById(ID_BY_COMPONENT.PTS_TAG_ID);
  if (!ptsTag) {
    ptsTag = document.createElement("span");
    ptsTag.id = ID_BY_COMPONENT.PTS_TAG_ID;
    ptsTag.className = "text-blue-500 ml-2";
    sum.appendChild(ptsTag);
  }
  ptsTag.textContent = `(포인트: ${bonusPts})`;
};

function updateStockInfo() {
  let infoMsg = "";
  productList.forEach(function (item) {
    if (item.qty < 5) {
      infoMsg += `${item.name}: ${
        item.qty > 0 ? `재고 부족 (${item.qty}개 남음)` : "품절"
      }\n`;
    }
  });
  stockInfo.textContent = infoMsg;
}

main();

addBtn.addEventListener("click", function () {
  const selItem = select.value;
  const itemToAdd = productList.find(function (p) {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.qty > 0) {
    const item = document.getElementById(itemToAdd.id);
    if (item) {
      const newQty =
        parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;
      if (newQty <= itemToAdd.qty) {
        item.querySelector(
          "span",
        ).textContent = `${itemToAdd.name} - ${itemToAdd.val}${CURRENCY} x ${newQty}`;
        itemToAdd.qty--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      const newItem = document.createElement("div");
      newItem.id = itemToAdd.id;
      newItem.className = "flex justify-between items-center mb-2";
      newItem.innerHTML =
        "<span>" +
        itemToAdd.name +
        " - " +
        itemToAdd.val +
        `${CURRENCY} x 1</span><div>` +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>';
      cart.appendChild(newItem);
      itemToAdd.qty--;
    }
    calcCart();
    lastSel = selItem;
  }
});

cart.addEventListener("click", function (event) {
  const tgt = event.target;
  if (
    tgt.classList.contains("quantity-change") ||
    tgt.classList.contains("remove-item")
  ) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    const prod = productList.find(function (p) {
      return p.id === prodId;
    });

    if (tgt.classList.contains("quantity-change")) {
      const qtyChange = parseInt(tgt.dataset.change);
      const newQty =
        parseInt(itemElem.querySelector("span").textContent.split("x ")[1]) +
        qtyChange;
      if (
        newQty > 0 &&
        newQty <=
          prod.qty +
            parseInt(itemElem.querySelector("span").textContent.split("x ")[1])
      ) {
        itemElem.querySelector("span").textContent = `${
          itemElem.querySelector("span").textContent.split("x ")[0]
        }x ${newQty}`;
        prod.qty -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.qty -= qtyChange;
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (tgt.classList.contains("remove-item")) {
      const remQty = parseInt(
        itemElem.querySelector("span").textContent.split("x ")[1],
      );
      prod.qty += remQty;
      itemElem.remove();
    }
    calcCart();
  }
});
