import { itemList } from "../constants/constants.js";

export default function managedCart(
  totalCost,
  tally,
  shoppingCart,
  cartTotalCost,
  stockStatus,
  bonus,
) {
  totalCost = 0;
  tally = 0;
  const cartItems = shoppingCart.children;
  let subTot = 0;
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < itemList.length; j++) {
        if (itemList[j].id === cartItems[i].id) {
          curItem = itemList[j];
          break;
        }
      }
      let qty = parseInt(
        cartItems[i].querySelector("span").textContent.split("x ")[1],
      );
      let itemTot = curItem.price * qty;
      let disc = 0;
      tally += qty;
      subTot += itemTot;
      if (qty >= 10) {
        if (curItem.id === "p1") disc = 0.1;
        else if (curItem.id === "p2") disc = 0.15;
        else if (curItem.id === "p3") disc = 0.2;
        else if (curItem.id === "p4") disc = 0.05;
        else if (curItem.id === "p5") disc = 0.25;
      }
      totalCost += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  if (tally >= 30) {
    const bulkDisc = totalCost * 0.25;
    const itemDisc = subTot - totalCost;
    if (bulkDisc > itemDisc) {
      totalCost = subTot * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (subTot - totalCost) / subTot;
    }
  } else {
    discRate = (subTot - totalCost) / subTot;
  }
  if (new Date().getDay() == 2) {
    totalCost *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }

  cartTotalCost.textContent = "총액: " + Math.round(totalCost) + "원";
  if (discRate > 0) {
    const span = document.createElement("span");
    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discRate * 100).toFixed(1) + "% 할인 적용)";
    cartTotalCost.appendChild(span);
  }
  updateStockStatus(stockStatus);
  renderbonus(totalCost, bonus, cartTotalCost);
}

const renderbonus = (totalCost, bonus, cartTotalCost) => {
  bonus = Math.floor(totalCost / 1000);
  let earnPoints = document.getElementById("loyalty-points");
  if (!earnPoints) {
    earnPoints = document.createElement("span");
    earnPoints.id = "loyalty-points";
    earnPoints.className = "text-blue-500 ml-2";
    cartTotalCost.appendChild(earnPoints);
  }
  earnPoints.textContent = "(포인트: " + bonus + ")";
};

// 재고 정보를 업데이트해주는 함수이기에 updateStockStatus라고 지음
const updateStockStatus = (stockStatus) => {
  let stockStatusMsg = "";
  itemList.forEach(function (item) {
    if (item.qty < 5) {
      stockStatusMsg +=
        item.name +
        ": " +
        (item.qty > 0 ? "재고 부족 (" + item.qty + "개 남음)" : "품절") +
        "\n";
    }
  });
  stockStatus.textContent = stockStatusMsg;
};
