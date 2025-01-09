import { useState } from 'react';

import CartTotal from './components/CartTotal';
import ProductSelect from './components/ProductSelect';
import { products as productsData } from './data/products';

const App = () => {
  const [products] = useState(productsData);
  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="${ELEMENT_IDS.CART_ITEMS}"></div>
        <div id="${ELEMENT_IDS.CART_TOTAL}" className="text-xl font-bold my-4">
          ${CartTotal({ amount: 0, discountRate: 0, point: 0 })}
        </div>
        ${ProductSelect({ products })}
        <button id="${ELEMENT_IDS.ADD_TO_CART}" className="bg-blue-500 text-white px-4 py-2 rounded">
          추가
        </button>
        <div id="${ELEMENT_IDS.STOCK_STATUS}" className="text-sm text-gray-500 mt-2" />
      </div>
    </div>
  );
};

export default App;
