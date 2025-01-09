import managedCart from "./functions/managedCart.js";
import ProductOptions from "./components/Product/ProductOptions.js";
import ShoppingCart from "./components/Shopping/ShoppingCart.js";
import CartTotalCost from "./components/Shopping/CartTotalCost.js";
import StockStatus from "./components/Shopping/StockStatus.js";
import AddButton from "./components/Product/AddButton.js";
import { handleAddItem, handleCartEvent } from "./functions/handlers.js";
import { discountAlert, suggestionAlert } from "./utils/alertFunc.js";
import PageLayout from "./layout/RootLayout/RootLayout.js";
let lastSelectedItem, // 마지막으로 선택한 상품
  bonus = 0, // 보너스 포인트
  totalCost = 0, // 총 합계
  tally = 0; // 총 아이템 개수

// 컴포넌트
const productOptions = ProductOptions();
const shoppingCart = ShoppingCart();
const cartTotalCost = CartTotalCost();
const stockStatus = StockStatus();
const addButton = AddButton();

// 메인 함수
function main() {
  // 전체 페이지 레이아웃
  PageLayout(
    shoppingCart,
    cartTotalCost,
    productOptions,
    addButton,
    stockStatus,
  );
  managedCart(
    totalCost,
    tally,
    shoppingCart,
    cartTotalCost,
    stockStatus,
    bonus,
  );
  discountAlert(30000, Math.random() * 10000);
  suggestionAlert(60000, Math.random() * 20000, lastSelectedItem);
}

// 메인 함수 실행
main();
addButton.addEventListener("click", () => {
  handleAddItem(productOptions, lastSelectedItem, shoppingCart);
  managedCart(
    totalCost,
    tally,
    shoppingCart,
    cartTotalCost,
    stockStatus,
    bonus,
  );
  console.log("tally", tally);
});
shoppingCart.addEventListener("click", (event) => {
  handleCartEvent(event);
  managedCart(
    totalCost,
    tally,
    shoppingCart,
    cartTotalCost,
    stockStatus,
    bonus,
  );
});
