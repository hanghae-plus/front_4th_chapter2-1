import MainPage from "./pages/MainPage";
import { addToCartClickHandler, alertLastSelEvent, alertSaleEvent, cartItemsClickHandler } from "./events";
import { renderToElement, scheduleInterval, calcCart, updateSelectOptions } from "./utils";

let lastSel = 0;

const main = () => {
  renderToElement("#app", MainPage());

  updateSelectOptions();
  calcCart();

  scheduleInterval(() => alertSaleEvent(lastSel), 30000, 10000);
  scheduleInterval(() => alertLastSelEvent(lastSel), 60000, 20000);
  document.querySelector("#add-to-cart").addEventListener("click", () => (lastSel = addToCartClickHandler()));
  document.querySelector("#cart-items").addEventListener("click", cartItemsClickHandler);
};

main();
