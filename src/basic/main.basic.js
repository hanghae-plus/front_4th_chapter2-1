import { updateCartUI } from './components/Cart';
import CartItem from './components/CartItem';
import CartTotal from './components/CartTotal';
import ProductSelect, { updateProductSelect } from './components/ProductSelect';
import { ELEMENT_IDS } from './constants/element-id';
import { products } from './data/products';
import { calculateCart } from './services/calculator';
import { setupLightningSaleTimer, setupRecommendationTimer } from './services/promotion';
import CartStore from './stores/cart.store';
import ProductStore from './stores/product.store';
import { canUpdateQuantity } from './utils/cart';
import {
  getAddCartButtonElement,
  getCartItemsElement,
  getDecreaseButtonElement,
  getIncreaseButtonElement,
  getProductItemElement,
  getProductSelectElement,
  getRemoveButtonElement,
} from './utils/dom';

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
});

const setupCartItemEvents = (productId, productModel) => {
  getDecreaseButtonElement(productId).addEventListener('click', () => handleDecreaseQuantity(productId));

  getIncreaseButtonElement(productId).addEventListener('click', () => handleIncreaseQuantity(productId, productModel));

  getRemoveButtonElement(productId).addEventListener('click', () => handleRemoveItem(productId));
};

const handleAddToCart = () => {
  const selectedProductId = getProductSelectElement().value;
  const selectedProductModel = products.find(({ id }) => id === selectedProductId);
  let cartItem = cartStore.getCartItem(selectedProductId);

  if (!canUpdateQuantity(selectedProductModel, cartItem)) {
    alert('재고가 부족합니다.');
    return;
  }

  cartStore.addCartItem(selectedProductModel);
  cartItem = cartStore.getCartItem(selectedProductId);

  const productItemElement = getProductItemElement(cartItem.id);

  if (productItemElement) {
    updateCartItemText(cartItem.id, cartItem);
  } else {
    getCartItemsElement().insertAdjacentHTML('beforeend', CartItem(cartItem));
    setupCartItemEvents(cartItem.id, selectedProductModel);
  }

  calculateCart((updatedTotals) => updateCartUI(updatedTotals));
  productStore.setLastSelectedProduct(selectedProductId);
};

getAddCartButtonElement().addEventListener('click', handleAddToCart);

const handleDecreaseQuantity = (productId) => {
  cartStore.removeCartItem(productId);
  const cartItem = cartStore.getCartItem(productId);

  if (cartItem?.getQuantity() === 0) {
    getProductItemElement(productId)?.remove();
  } else {
    updateCartItemText(productId, cartItem);
  }
  calculateCart((updatedTotals) => updateCartUI(updatedTotals));
};

const handleIncreaseQuantity = (productId, productModel) => {
  const currentCartItem = cartStore.getCartItem(productId);

  if (!canUpdateQuantity(productModel, currentCartItem)) {
    alert('재고가 부족합니다.');
    return;
  }

  cartStore.addCartItem(productModel);
  updateCartItemText(productId, cartStore.getCartItem(productId));
  calculateCart((updatedTotals) => updateCartUI(updatedTotals));
};

const handleRemoveItem = (productId) => {
  getProductItemElement(productId)?.remove();
  cartStore.deleteCartItem(productId);
  calculateCart((updatedTotals) => updateCartUI(updatedTotals));
};

const updateCartItemText = (productId, cartItem) => {
  const container = document.createElement('div');
  container.innerHTML = CartItem(cartItem);

  const oldElement = getProductItemElement(productId);
  oldElement.replaceWith(container.firstElementChild);
  setupCartItemEvents(productId, cartItem);
};
