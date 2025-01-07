import Point from '../components/Point';
import SelectOption from '../components/SelectOption';
import StockInfo from '../components/StockInfo';
import Total from '../components/Total';
import { handleAddToCart, handleCartActions } from '../events/CartEventHandler';
import { createElement } from '../utils/createElement';
import { additionSale, specialSale } from '../utils/randomSale';

function Cart() {
  const root = document.getElementById('app');

  const header = createElement(
    'h1',
    { class: 'text-2xl font-bold mb-4' },
    '장바구니'
  );
  const cartDisp = createElement('div', { id: 'cart-items', class: 'my-4' });
  const cartTotal = createElement('div', {
    id: 'cart-total',
    class: 'text-xl font-bold my-4'
  });
  const stockInfo = createElement('div', {
    id: 'stock-status',
    class: 'text-sm text-gray-500 mt-2'
  });

  const prodSelect = createElement('select', {
    id: 'product-select',
    class: 'border rounded p-2 mr-2'
  });
  const addBtn = createElement(
    'button',
    { id: 'add-to-cart', class: 'bg-blue-500 text-white px-4 py-2 rounded' },
    '추가'
  );

  const wrap = createElement(
    'div',
    {
      class:
        'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'
    },
    [header, cartDisp, cartTotal, prodSelect, addBtn, stockInfo]
  );

  const container = createElement('div', { class: 'bg-gray-100 p-8' }, wrap);

  root.appendChild(container);

  Total(0, 0);
  Point();
  SelectOption();
  StockInfo();

  specialSale();
  additionSale();

  addBtn.addEventListener('click', () => handleAddToCart(prodSelect));
  cartDisp.addEventListener('click', handleCartActions);
}

export default Cart;
