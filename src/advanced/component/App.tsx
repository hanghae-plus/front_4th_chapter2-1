import React from 'react';
import { CartItem } from './CartItem';
import { ProductSelector } from './ProductSelector';
import { AddToCart } from './AddToCart';
import { OrderSummary } from './OrderSummary';
import { LowStockWarning } from './LowStockWarning';
import { useState } from 'react';
import { Product } from '../type/type';
import { productList } from '../data/data';

//TODO1: 같은 상품을 추가할 때는 재고만 증가한다.(현재는 컴포넌트가 복제됨)
// -> 장바구니에 이미 있는 상품인지 확인하고 있으면 재고만 증가하도록 수정
// -> 재고를 관리하는 상태를 추가해야힘 => 결론: products state 추가 -> 기존에 productData 사용하던 것을 products로 변경
//TODO2: 장바구니 상품 개수 관리 이벤트
//TODO3: 삭제 이벤트
//TODO4: 할인 적용
//TODO5: 포인트 계산
//TODO6: 총액 계산
//TODO7: 할인 적용 조건 추가
//TODO8: 재고관리
//TODO9: 깜짝 이벤트, 추천 이벤트

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
          <AddToCart
            selectedProduct={selectedProduct}
            setCartItems={setCartItems}
            setProducts={setProducts}
          />
          <LowStockWarning products={products} />
          <div id='cart-items'>
            {cartItems.map((product) => (
              <CartItem addedItem={product} />
            ))}
          </div>
          <OrderSummary cartItems={cartItems} />
        </div>
      </div>
    </div>
  );
};
