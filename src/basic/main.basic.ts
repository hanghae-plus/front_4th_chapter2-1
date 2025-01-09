import { addCartItemEvent } from './features/cart/actions/addCartItemEvent';
import { calculateCartItems } from './features/cart/actions/calculateCartItems';
import { luckyAlert } from './features/product/actions/luckyAlert';
import { productList } from './shared/entity/data/productList';
import { renderAfterDiscount } from './shared/actions/renderAfterDiscount';
import { productAddClickEvent } from './features/product/actions/productAddClickEvent';
import { updateSelectedOptions } from './features/product/actions/updateSelectedOptions';

function main() {
  const Root = document.getElementById('app');
  if (!Root) return;
  Root.innerHTML = `
  <div class="bg-gray-100 p-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 class="text-2xl font-bold mb-4">장바구니</h1>
      <div id="cart-items"></div>
      <div id="cart-total" class="text-xl font-bold my-4"></div>
      <select id="product-select" class="border rounded p-2 mr-2"></select>
      <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
      <div id="stock-status" class="text-sm text-gray-500 mt-2"></div>
    </div>
  `;
  updateSelectedOptions();
  calculateCartItems(
    {
      cartItems:
        document.getElementById('cart-items')?.children || new HTMLCollection(),
      productList,
    },
    renderAfterDiscount,
  );
  addCartItemEvent();
  productAddClickEvent();

  luckyAlert(productList, updateSelectedOptions);
}

main();
