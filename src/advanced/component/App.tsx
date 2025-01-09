import { CartItem } from './CartItem';
import { ProductSelector } from './ProductSelector';
import { AddToCartButton } from './AddToCartButton';
import { OrderSummary } from './OrderSummary';
import { LowStockWarning } from './LowStockWarning';
import { useState } from 'react';
import { Product } from '../type/type';
import { productList } from '../data/data';

export const App = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>(productList);

  return (
    <div>
      <div className='bg-gray-100 p-8'>
        <div className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'>
          <h1 className='text-2xl font-bold mb-4'>장바구니</h1>
          <ProductSelector setSelectedProduct={setSelectedProduct} products={products} />
          <AddToCartButton
            products={products}
            selectedProduct={selectedProduct}
            setCartItems={setCartItems}
            setProducts={setProducts}
          />
          <LowStockWarning products={products} />
          <div id='cart-items'>
            {cartItems.map((addedItem) => (
              <CartItem addedItem={addedItem} key={addedItem.id} />
            ))}
          </div>
          <OrderSummary cartItems={cartItems} />
        </div>
      </div>
    </div>
  );
};
