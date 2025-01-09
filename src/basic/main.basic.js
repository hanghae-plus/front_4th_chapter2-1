import { updateCartUI } from './components/Cart';
import CartItem from './components/CartItem';
import CartTotal from './components/CartTotal';
import ProductSelect from './components/ProductSelect';
import { ELEMENT_IDS } from './constants/element-id';
import { DISCOUNT_POLICY, TIMER_POLICY } from './constants/policy';
import { products } from './data/products';
import { calculateCart } from './services/calculator';
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

const updateProductList = () => {
  const selectElement = getProductSelectElement();
  selectElement.innerHTML = ProductSelect({ products });
};

const setupLightningSaleTimer = () => {
  setTimeout(() => {
    setInterval(handleLightningSale, TIMER_POLICY.LIGHTNING_SALE_RATE_INTERVAL);
  }, Math.random() * 10000);
};

const handleLightningSale = () => {
  const luckyItem = products[Math.floor(Math.random() * products.length)];
  if (Math.random() < DISCOUNT_POLICY.LIGHTNING_SALE_RATE_PROBABILITY && luckyItem.quantity > 0) {
    luckyItem.price = Math.round(luckyItem.price * (1 - DISCOUNT_POLICY.LIGHTNING_SALE_RATE));
    alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
    updateProductList();
  }
};

const setupRecommendationTimer = () => {
  setTimeout(() => {
    setInterval(handleRecommendation, TIMER_POLICY.PRODUCT_RECOMMENDATION_INTERVAL);
  }, Math.random() * 20000);
};

const handleRecommendation = () => {
  if (!productStore.getLastSelectedProduct()) {
    return;
  }

  const suggest = products.find((item) => item.id !== productStore.getLastSelectedProduct() && item.quantity > 0);

  if (suggest) {
    alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
    suggest.price = Math.round(suggest.price * (1 - DISCOUNT_POLICY.RECOMMENDATION_DISCOUNT_RATE));
    updateProductList();
  }
};

main(() => {
  updateProductList();
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
