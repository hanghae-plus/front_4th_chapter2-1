import { productStore } from "./entities/product";
import { cartStore } from "./features/cart";
import { CartPage } from "./pages/cart-page";
import { setupEventListeners, updateElement } from "./shared/lib";

function main() {
  const $root = document.getElementById("app") as HTMLDivElement;

  if (!$root.firstChild) {
    $root.innerHTML = CartPage();
  } else {
    const $template = document.createElement("template");
    $template.innerHTML = CartPage();
    updateElement(
      $root,
      $root.firstChild as HTMLElement,
      $template.content.firstElementChild as HTMLElement
    );
  }

  setupEventListeners($root);
}

cartStore.subscribe(main);
productStore.subscribe(main);

setTimeout(() => {
  setInterval(() => {
    const { products } = productStore.getState();
    const luckyItem = products[Math.floor(Math.random() * products.length)];
    if (Math.random() < 0.3 && luckyItem.q > 0) {
      luckyItem.val = Math.round(luckyItem.val * 0.8);
      alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
    }
  }, 30000);
}, Math.random() * 10000);

setTimeout(() => {
  setInterval(() => {
    const $productSelect = document.getElementById(
      "product-select"
    ) as HTMLSelectElement;

    const selectedProductId = $productSelect.value;

    if (selectedProductId) {
      const { products } = productStore.getState();

      const suggest = products.find(function (item) {
        return item.id !== selectedProductId && item.q > 0;
      });
      if (suggest) {
        alert(suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!");
        suggest.val = Math.round(suggest.val * 0.95);
      }
    }
  }, 60000);
}, Math.random() * 20000);

main();
