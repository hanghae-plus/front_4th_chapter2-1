import CartList from '../components/CartList';
import SelectOption from '../components/SelectOption';
import StockInfo from '../components/StockInfo';
import Total from '../components/Total';
import { additionSale, specialSale } from '../utils/randomSale';

function Cart() {
  const root = document.getElementById('app');

  const render = () => {
    root.innerHTML = `
    <div class="bg-gray-100 p-8">
      <div id="wrap" class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
      </div>  
      </div>
    `;

    const wrap = root.querySelector('#wrap');

    wrap.appendChild(CartList());
    wrap.appendChild(Total());
    wrap.appendChild(SelectOption());
    wrap.appendChild(StockInfo());
  };

  render();

  additionSale();
  specialSale();
}

export default Cart;
