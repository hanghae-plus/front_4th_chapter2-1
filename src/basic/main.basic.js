import { ItemOption } from "./components";
import MainPage from "./pages/MainPage";
import { productsStore } from "./store/productsStore";
import {
  renderToElement,
  scheduleInterval,
  calcCart,
  addToCartClickHandler,
  cartItemsClickHandler,
} from "./utils";

let lastSel = 0;
const products = productsStore.getInstance().getProducts();

const updateSelOpts = () => {
  renderToElement("#product-select", products.map(ItemOption).join(""));
};

const saleEvent = () => {
  const luckyItem = products[Math.floor(Math.random() * products.length)];
  if (Math.random() < 0.3 && luckyItem.quantity > 0) {
    luckyItem.price = Math.round(luckyItem.price * 0.8);
    alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
    updateSelOpts();
  }
};

const lastSelEvent = () => {
  if (lastSel) {
    const suggest = products.find(
      (item) => item.id !== lastSel && item.quantity > 0
    );
    if (suggest) {
      alert(suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!");
      suggest.price = Math.round(suggest.price * 0.95);
      updateSelOpts();
    }
  }
};

const main = () => {
  renderToElement("#app", MainPage());

  updateSelOpts();
  calcCart();

  scheduleInterval(saleEvent, 30000, 10000);
  scheduleInterval(lastSelEvent, 60000, 20000);

  document
    .querySelector("#add-to-cart")
    .addEventListener("click", () => (lastSel = addToCartClickHandler()));
  document
    .querySelector("#cart-items")
    .addEventListener("click", cartItemsClickHandler);
};

main();
