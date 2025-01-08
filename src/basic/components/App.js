import { createElement } from '../core/createElement.js';
import { AddToCartButton, CartHeader, CartItems, CartTotal } from './Cart.js';
import { ProductSelector, StockStatus } from './Product.js';

const App = () => {
  const container = createElement('div', {
    className: 'bg-gray-100 p-8'
  });

  const wrapper = createElement('div', {
    className:
      'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'
  });

  const initialComponents = [
    CartHeader(),
    ProductSelector(),
    AddToCartButton(),
    StockStatus(),
    CartItems(),
    CartTotal()
  ];

  initialComponents.forEach((component) => wrapper.appendChild(component));
  container.appendChild(wrapper);

  return container;
};

export default App;
