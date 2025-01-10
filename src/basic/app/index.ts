import { CartPage } from "@basic/pages/cart-page";
import { cartStore } from "@basic/features/cart";
import { productStore } from "@basic/entities/product";
import { setupEventListeners, updateElement } from "@basic/shared/lib";

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
    if (Math.random() < 0.3 && luckyItem.quantity > 0) {
      luckyItem.cost = Math.round(luckyItem.cost * 0.8);
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
        return item.id !== selectedProductId && item.quantity > 0;
      });
      if (suggest) {
        alert(suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!");
        suggest.cost = Math.round(suggest.cost * 0.95);
      }
    }
  }, 60000);
}, Math.random() * 20000);

main();
