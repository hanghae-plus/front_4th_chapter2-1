// import { PRODUCT_LIST } from "./src/data/prodList";
// import { calculateCartTotals } from "./src/util/calculate";
// import { handleDeleteToCart, updateCartList } from "./src/events/cartEvent";
// var sel, addBtn, cartDisp, sum, stockInfo;
// var lastSel,
//   bonusPoints = 0;

// function main() {
//   var root = document.getElementById("app");
//   let cont = document.createElement("div");
//   var wrap = document.createElement("div");
//   let hTxt = document.createElement("h1");
//   cartDisp = document.createElement("div");
//   sum = document.createElement("div");
//   sel = document.createElement("select");
//   addBtn = document.createElement("button");
//   stockInfo = document.createElement("div");
//   cartDisp.id = "cart-items";
//   sum.id = "cart-total";
//   sel.id = "product-select";
//   addBtn.id = "add-to-cart";
//   stockInfo.id = "stock-status";
//   cont.className = "bg-gray-100 p-8";
//   wrap.className =
//     "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";
//   hTxt.className = "text-2xl font-bold mb-4";
//   sum.className = "text-xl font-bold my-4";
//   sel.className = "border rounded p-2 mr-2";
//   addBtn.className = "bg-blue-500 text-white px-4 py-2 rounded";
//   stockInfo.className = "text-sm text-gray-500 mt-2";
//   hTxt.textContent = "장바구니";
//   addBtn.textContent = "추가";
//   updateSelOpts();
//   wrap.appendChild(hTxt);
//   wrap.appendChild(cartDisp);
//   wrap.appendChild(sum);
//   wrap.appendChild(sel);
//   wrap.appendChild(addBtn);
//   wrap.appendChild(stockInfo);
//   cont.appendChild(wrap);
//   root.appendChild(cont);
//   calcCart();
//   setTimeout(function () {
//     setInterval(function () {
//       var luckyItem =
//         PRODUCT_LIST[Math.floor(Math.random() * PRODUCT_LIST.length)];
//       if (Math.random() < 0.3 && luckyItem.stock > 0) {
//         luckyItem.cost = Math.round(luckyItem.cost * 0.8);
//         alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
//         updateSelOpts();
//       }
//     }, 30000);
//   }, Math.random() * 10000);
//   setTimeout(function () {
//     setInterval(function () {
//       if (lastSel) {
//         var suggest = PRODUCT_LIST.find(function (item) {
//           return item.id !== lastSel && item.stock > 0;
//         });
//         if (suggest) {
//           alert(
//             suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!"
//           );
//           suggest.cost = Math.round(suggest.cost * 0.95);
//           updateSelOpts();
//         }
//       }
//     }, 60000);
//   }, Math.random() * 20000);
// }
// function updateSelOpts() {
//   sel.innerHTML = "";
//   PRODUCT_LIST.forEach(function (item) {
//     var opt = document.createElement("option");
//     opt.value = item.id;
//     opt.textContent = item.name + " - " + item.cost + "원";
//     if (item.stock === 0) opt.disabled = true;
//     sel.appendChild(opt);
//   });
// }
// function calcCart() {
//   let totalAmount = 0;
//   const cartItems = Array.from(cartDisp.children);
//   const { subTotal, totalDiscount, itemCount, discountRate } =
//     calculateCartTotals(cartItems);
//   totalAmount = subTotal - totalDiscount;

//   const bulkDiscountRate = itemCount >= 30 ? 0.25 : discountRate;
//   const tuesdayDiscountRate = new Date().getDay() === 2 ? 0.1 : 0;

//   const finalDiscountRate = Math.max(bulkDiscountRate, tuesdayDiscountRate);
//   totalAmount *= 1 - finalDiscountRate;

//   updateSummaryUI(totalAmount, finalDiscountRate);
// }

// const updateSummaryUI = (totalAmount, finalDiscountRate) => {
//   sum.textContent = "총액: " + Math.round(totalAmount) + "원";

//   if (finalDiscountRate > 0) {
//     var span = document.createElement("span");
//     span.className = "text-green-500 ml-2";
//     span.textContent = `(${(finalDiscountRate * 100).toFixed(1)}% 할인 적용)`;
//     sum.appendChild(span);
//   }
//   updateStockInfo();
//   renderBonusPts(totalAmount);
// };
// const renderBonusPts = (totalAmount) => {
//   bonusPoints = Math.floor(totalAmount / 1000);
//   var pointTag = document.getElementById("loyalty-points");
//   if (!pointTag) {
//     pointTag = document.createElement("span");
//     pointTag.id = "loyalty-points";
//     pointTag.className = "text-blue-500 ml-2";
//     sum.appendChild(pointTag);
//   }
//   pointTag.textContent = "(포인트: " + bonusPoints + ")";
// };
// function updateStockInfo() {
//   var infoMsg = "";
//   PRODUCT_LIST.forEach(function (item) {
//     if (item.stock < 5) {
//       infoMsg +=
//         item.name +
//         ": " +
//         (item.stock > 0 ? "재고 부족 (" + item.stock + "개 남음)" : "품절") +
//         "\n";
//     }
//   });
//   stockInfo.textContent = infoMsg;
// }
// main();

// addBtn.addEventListener("click", function () {
//   var selItem = sel.value;
//   var itemToAdd = PRODUCT_LIST.find(function (p) {
//     return p.id === selItem;
//   });
//   const newItem = updateCartList(itemToAdd);
//   if (newItem) {
//     cartDisp.appendChild(newItem);
//     lastSel = itemToAdd;
//   }
//   calcCart();
// });

// cartDisp.addEventListener("click", function (event) {
//   var target = event.target;
//   if (
//     target.classList.contains("quantity-change") ||
//     target.classList.contains("remove-item")
//   ) {
//     handleDeleteToCart(target);
//     calcCart();
//   }
// });
import ReactDOM from "react-dom/client";
import { App } from "./src/App";

const container = document.getElementById("app");
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
} else {
  console.error("Target container 'app' not found in the DOM.");
}
