import { useState } from 'react';

import CartTotal from './components/CartTotal';
import ProductSelect from './components/ProductSelect';
import { products as initialProducts } from './data/products';
import { calculateCartTotals } from './services/calculator';
import type { Cart } from './types/cart.type';

const App = () => {
  const [cartItems, setCartItems] = useState<Cart[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const handleAddToCart = () => {
    const selectedProduct = initialProducts.find(({ id }) => id === selectedProductId);

    if (!selectedProduct || selectedProduct.quantity <= 0) {
      alert('재고가 부족합니다.');
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === selectedProductId);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === selectedProductId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      const newCartItem: Cart = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: 1,
      };

      return [...prevItems, newCartItem];
    });
  };

  const { finalAmount: amount, discountRate, point } = calculateCartTotals(cartItems);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="${ELEMENT_IDS.CART_ITEMS}"></div>
        <div id="${ELEMENT_IDS.CART_TOTAL}" className="text-xl font-bold my-4">
          <CartTotal amount={amount} discountRate={discountRate} point={point} />
        </div>
        <ProductSelect products={initialProducts} />
        <button
          id="${ELEMENT_IDS.ADD_TO_CART}"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddToCart}
        >
          추가
        </button>
        <div id="${ELEMENT_IDS.STOCK_STATUS}" className="text-sm text-gray-500 mt-2" />
      </div>
    </div>
  );
};

export default App;
