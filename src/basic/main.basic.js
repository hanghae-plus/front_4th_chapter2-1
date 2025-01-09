export const ID_BY_COMPONENT = Object.freeze({
  CART_ID: "cart-items",
  SUM_ID: "cart-total",
  SELECT_ID: "product-select",
  ADD_BTN_ID: "add-to-cart",
  STOCK_INFO_ID: "stock-status",
  PTS_TAG_ID: "loyalty-points",
});

let appState = {
  productList: [
    { id: "p1", name: "상품1", val: 10000, qty: 50 },
    { id: "p2", name: "상품2", val: 20000, qty: 30 },
    { id: "p3", name: "상품3", val: 30000, qty: 20 },
    { id: "p4", name: "상품4", val: 15000, qty: 0 },
    { id: "p5", name: "상품5", val: 25000, qty: 10 },
  ],
  lastSel: null,
  bonusPts: 0,
  totalAmt: 0,
  itemCnt: 0,
};

/** 
 * select option update 
 * */
const updateSelectOption = () => {
  const select = document.querySelector(`#${ID_BY_COMPONENT.SELECT_ID}`);
  select.innerHTML = '';
  appState.productList.forEach(function (item) {
    let option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name + " - " + item.val + "원";
    if (item.q === 0) option.disabled = true;
    select.appendChild(option);
  });
}

/** 장바구니 표기 */
const updateCart = () => {
  const cartItems = document.querySelector(`#${ID_BY_COMPONENT.CART_ID}`).children;
  let subTot = 0;
  appState.totalAmt = 0;

  //장바구니에 들어있는 상품들의 수, 금액 계산
  Array.from(cartItems).forEach((cartItem) => {
    const { itemTot, disc } = getCalcCartItem(cartItem)
    appState.totalAmt += itemTot * (1 - disc)
    subTot += itemTot;
  })

  const discRate = getAdditionalDiscountRate(subTot);
  updateTotalAmt(discRate);
  updateStockInfo();
  updateBonusPts();
}


/**
 * 장바구니 상품별 데이터 계산
 * @param {*} cartItem 
 * @returns 
 */
const getCalcCartItem = (cartItem) => {
  let curItem = appState.productList.find(
    (product) => product.id === cartItem.id
  );

  if (!curItem) {
    console.warn(`Product with ID ${cartItem.id} not found`);
    return { itemTot: 0, qty: 0, disc: 0 };
  }

  let qty = parseInt(
    cartItem.querySelector("span").textContent.split("x ")[1]
  );
  let itemTot = curItem.val * qty;
  console.log('itemTot', itemTot)
  let disc = 0;

  if (qty >= 10) {
    if (curItem.id === "p1") disc = 0.1;
    else if (curItem.id === "p2") disc = 0.15;
    else if (curItem.id === "p3") disc = 0.2;
    else if (curItem.id === "p4") disc = 0.05;
    else if (curItem.id === "p5") disc = 0.25;
  }

  console.log(`Discount for ${curItem.id}: ${disc}`);
  return { itemTot, disc };
}

/**
 * 추가 할인률 계산
 * @param {*} subTot 
 * @returns 
 */
const getAdditionalDiscountRate = (subTot) => {
  let discRate = 0;

  //30개 이상 구매시 할인률
  if (appState.itemCnt >= 30) {
    let bulkDisc = appState.totalAmt * 0.25;
    let itemDisc = subTot - appState.totalAmt;
    if (bulkDisc > itemDisc) {
      appState.totalAmt = subTot * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (subTot - appState.totalAmt) / subTot;
    }
  } else {
    discRate = (subTot - appState.totalAmt) / subTot;
  }

  // 화요일 할인률
  if (new Date().getDay() === 2) {
    appState.totalAmt *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }

  return discRate
}

/**
 * 총액 표기
 */
const updateTotalAmt = (discRate) => {
  const sum = document.querySelector(`#${ID_BY_COMPONENT.SUM_ID}`);
  sum.textContent = "총액: " + Math.round(appState.totalAmt) + "원";

  if (discRate > 0) {
    let span = document.createElement("span");
    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discRate * 100).toFixed(1) + "% 할인 적용)";
    sum.appendChild(span);
  }
}

/**
 * 보너스 포인트 표기
 */
const updateBonusPts = () => {
  const sum = document.querySelector(`#${ID_BY_COMPONENT.SUM_ID}`);
  appState.bonusPts = Math.floor(appState.totalAmt / 1000);
  let ptsTag = document.getElementById("loyalty-points");
  if (!ptsTag) {
    ptsTag = document.createElement("span");
    ptsTag.id = "loyalty-points";
    ptsTag.className = "text-blue-500 ml-2";
    sum.appendChild(ptsTag);
  }
  ptsTag.textContent = "(포인트: " + appState.bonusPts + ")";
};

/**
 * 재고 표기
 */
const updateStockInfo = () => {
  const stockInfo = document.querySelector(`#${ID_BY_COMPONENT.STOCK_INFO_ID}`);
  let infoMsg = "";
  appState.productList.forEach(function (item) {
    if (item.q < 5) {
      infoMsg +=
        item.name +
        ": " +
        (item.q > 0 ? "재고 부족 (" + item.q + "개 남음)" : "품절") +
        "\n";
    }
  });
  stockInfo.textContent = infoMsg;
}

/** 번개 세일 alert */
const setLuckySaleAlert = () => {
  setTimeout(() => {
    setInterval(() => {
      let luckyItem = appState.productList[
        Math.floor(Math.random() * appState.productList.length)
      ];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        updateSelectOption();
      }
    }, 30000);
  }, Math.random() * 10000);
}

/** 추천상품 세일 alert*/
const setSuggestDiscountedProductAlert = () => {
  setTimeout(() => {
    setInterval(() => {
      if (appState.lastSel) {
        let suggest = appState.productList.find((item) => {
          return item.id !== appState.lastSel && item.q > 0;
        });
        if (suggest) {
          alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          suggest.val = Math.round(suggest.val * 0.95);
          updateSelectOption();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function main() {
  const root = document.getElementById("app");

  const contents = document.createElement("div");
  contents.className = "bg-gray-100 p-8";
  contents.innerHTML = `
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 class="text-2xl font-bold mb-4">장바구니</h1>
      <div id="${ID_BY_COMPONENT.CART_ID}"></div>
      <div id="${ID_BY_COMPONENT.SUM_ID}" class="text-xl font-bold my-4"></div>
      <select id="${ID_BY_COMPONENT.SELECT_ID}" class="border rounded p-2 mr-2"></select>
      <button id="${ID_BY_COMPONENT.ADD_BTN_ID}" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
      <div id="${ID_BY_COMPONENT.STOCK_INFO_ID}" class="text-sm text-gray-500 mt-2"></div>
    </div>
  `;

  root.appendChild(contents);

  updateSelectOption();
  updateCart();

  setLuckySaleAlert()
  setSuggestDiscountedProductAlert()
}




main();


const addBtn = document.querySelector(`#${ID_BY_COMPONENT.ADD_BTN_ID}`);
addBtn.addEventListener("click", function () {
  const cart = document.querySelector(`#${ID_BY_COMPONENT.CART_ID}`);
  const selectItem = document.querySelector(`#${ID_BY_COMPONENT.SELECT_ID}`).value;
  const itemToAdd = appState.productList.find(function (p) {
    return p.id === selectItem;
  });

  if (itemToAdd && itemToAdd.qty > 0) {
    let item = document.getElementById(itemToAdd.id);
    if (item) {
      let newQty =
        parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;

      if (newQty <= itemToAdd.qty) {
        item.querySelector("span").textContent =
          itemToAdd.name + " - " + itemToAdd.val + "원 x " + newQty;
        itemToAdd.qty--;
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
        itemToAdd.val +
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
      cart.appendChild(newItem);
      itemToAdd.qty--;
    }
    updateCart();
    appState.lastSel = selectItem;
  }
});

const cart = document.querySelector(`#${ID_BY_COMPONENT.CART_ID}`);
cart.addEventListener("click", function (event) {
  let tgt = event.target;
  if (
    tgt.classList.contains("quantity-change") ||
    tgt.classList.contains("remove-item")
  ) {
    let prodId = tgt.dataset.productId;
    let itemElem = document.getElementById(prodId);
    let prod = appState.productList.find(function (p) {
      return p.id === prodId;
    });
    if (tgt.classList.contains("quantity-change")) {
      let qtyChange = parseInt(tgt.dataset.change);
      let newQty =
        parseInt(itemElem.querySelector("span").textContent.split("x ")[1]) +
        qtyChange;
      if (
        newQty > 0 &&
        newQty <=
        prod.qty +
        parseInt(itemElem.querySelector("span").textContent.split("x ")[1])
      ) {
        itemElem.querySelector("span").textContent =
          itemElem.querySelector("span").textContent.split("x ")[0] +
          "x " +
          newQty;
        prod.qty -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.qty -= qtyChange;
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (tgt.classList.contains("remove-item")) {
      let remQty = parseInt(
        itemElem.querySelector("span").textContent.split("x ")[1]
      );
      prod.qty += remQty;
      itemElem.remove();
    }
    updateCart();
  }
});

/// 껍데기만 create로 만들고 나머지는 innerhtml로 만들기 -> react랑 닮게 만들기
// var 호이스팅

//object freeze -> element id로 선언
//amount , quantity

// 추상화 수준 맞추기
