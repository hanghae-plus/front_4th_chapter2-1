import {
  cartDisplay,
  cartTotal,
  productStockInfo,
  selectedProduct,
} from '../main.basic.js';

export function App() {
  const contentContainer = document.createElement('div');
  contentContainer.className = 'bg-gray-100 p-8';

  const wrapper = document.createElement('div');
  wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  const headerTitle = document.createElement('h1');
  headerTitle.className = 'text-2xl font-bold mb-4';
  headerTitle.textContent = '장바구니';

  const addToCartButton = document.createElement('button');
  addToCartButton.id = 'add-to-cart';
  addToCartButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  addToCartButton.textContent = '추가';

  useCartActions(addToCartButton);

  wrapper.appendChild(headerTitle);
  wrapper.appendChild(cartDisplay);
  wrapper.appendChild(cartTotal);
  wrapper.appendChild(selectedProduct);
  wrapper.appendChild(addToCartButton);
  wrapper.appendChild(productStockInfo);

  contentContainer.appendChild(wrapper);
  return contentContainer;
}
