import { updateCartUI } from './components/Cart';
import CartTotal from './components/CartTotal';
import ProductSelect, { updateProductSelect } from './components/ProductSelect';
import { ELEMENT_IDS } from './constants/element-id';
import { products } from './data/products';
import { calculateCart } from './services/calculator';
import { handleAddToCart } from './services/cart';
import { setupLightningSaleTimer, setupRecommendationTimer } from './services/promotion';
import CartStore from './stores/cart.store';
import ProductStore from './stores/product.store';
import { getAddCartButtonElement } from './utils/dom';

const main = (callbackFn) => {
  const root = document.getElementById('app');
  root.innerHTML = /* html */ `
    <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="${ELEMENT_IDS.CART_ITEMS}"></div>
        <div id="${ELEMENT_IDS.CART_TOTAL}" class="text-xl font-bold my-4">
          ${CartTotal({ amount: 0, discountRate: 0, point: 0 })}
        </div>
        ${ProductSelect({ products })}
        <button id="${ELEMENT_IDS.ADD_TO_CART}" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
        <div id="${ELEMENT_IDS.STOCK_STATUS}" class="text-sm text-gray-500 mt-2"></div>
      </div>
    </div>
  `;

  window.productStore = ProductStore.createInstance();
  window.cartStore = CartStore.createInstance();

  callbackFn();
};

main(() => {
  updateProductSelect();
  calculateCart((updatedTotals) => updateCartUI(updatedTotals));
  setupLightningSaleTimer();
  setupRecommendationTimer();
  getAddCartButtonElement().addEventListener('click', handleAddToCart);
});
