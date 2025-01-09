import React from 'react';
import { CartItem } from './CartItem';
import { ProductSelector } from './ProductSelector';
import { AddToCart } from './AddToCart';
import { OrderSummary } from './OrderSummary';
import { LowStockWarning } from './LowStockWarning';
import { useState } from 'react';
import { Product } from '../type/type';

export const App = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  console.log('cartItems', cartItems);
  return (
    <div>
      <div className="bg-gray-100 p-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
          <h1 className="text-2xl font-bold mb-4">장바구니</h1>
          <ProductSelector setSelectedProduct={setSelectedProduct} />
          <AddToCart
            selectedProduct={selectedProduct}
            setCartItems={setCartItems}
          />
          <LowStockWarning />
          <div id="cart-items">
            {cartItems.map((product) => (
              <CartItem addedItem={product} />
            ))}
          </div>
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};
