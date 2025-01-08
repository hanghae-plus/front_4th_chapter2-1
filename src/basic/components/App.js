import { ProductSelect } from './ProductSelect.js';
import { CartDisplay } from './CartDisplay.js';
import { CartTotal } from './CartTotal.js';
import { StockInfo } from './StockInfo.js';
import { useCartActions } from '../hooks/useCartActions.js';

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

  const cartDisplay = CartDisplay();
  const cartTotal = CartTotal();
  const productSelect = ProductSelect();
  const stockInfo = StockInfo();

  useCartActions(
    addToCartButton,
    productSelect,
    cartDisplay,
    cartTotal,
    stockInfo,
  );

  wrapper.appendChild(headerTitle);
  wrapper.appendChild(cartDisplay);
  wrapper.appendChild(cartTotal);
  wrapper.appendChild(productSelect);
  wrapper.appendChild(addToCartButton);
  wrapper.appendChild(stockInfo);

  contentContainer.appendChild(wrapper);
  return contentContainer;
}
