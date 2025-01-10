import { CartItem } from './CartItem';
import { ProductSelector } from './ProductSelector';
import { AddToCartButton } from './AddToCartButton';
import { OrderSummary } from './OrderSummary';
import { LowStockWarning } from './LowStockWarning';
import { useEffect, useState } from 'react';
import { Product } from '../type/type';
import { productList } from '../data/data';

export const App = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>(productList);

  //30초에 한번 30% 확률로 번개 세일 발생
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        alert(`🎉 번개 세일! ${randomProduct.name} 20% 할인!`);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [products]);

  // 1분마다 마지막으로 선택한 상품 외 다른 상품 추천
  useEffect(() => {
    const interval = setInterval(() => {
      const suggestionProduct = products.find((product) => product.id !== selectedProduct?.id);
      if (suggestionProduct) {
        alert(`${suggestionProduct.name} 은(는) 어떠세요? 지금 구매하시면 5% 할인!`);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [selectedProduct]);

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
          <div id='cart-items' data-testid={`cart-items`}>
            {cartItems.length > 0 ? (
              cartItems.map((addedItem) => (
                <CartItem
                  key={addedItem.id}
                  products={products}
                  addedItem={addedItem}
                  setCartItems={setCartItems}
                  setProducts={setProducts}
                />
              ))
            ) : (
              <p>장바구니가 비었습니다.</p>
            )}
          </div>
          <OrderSummary cartItems={cartItems} />
        </div>
      </div>
    </div>
  );
};
