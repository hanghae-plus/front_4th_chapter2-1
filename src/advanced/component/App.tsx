import React from 'react';
import { CartItem } from './CartItem';
import { productData } from '../../basic/data/data';
import { ProductSelector } from './ProductSelector';

export const App = () => {
  return (
    <div>
      <div className="bg-gray-100 p-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
          <h1 className="text-2xl font-bold mb-4">장바구니</h1>
          {/* select product */}
          <ProductSelector />

          {/* add to cart */}
          <button
            id="add-to-cart"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            장바구니 추가
          </button>

          {/* 재고 부족 표시 */}
          <div
            id="stock-status"
            className="text-sm text-gray-500 mt-2 flex flex-col whitespace-pre-wrap"
          >
            {productData.map((product) => (
              <div key={product.id}>
                {product.name}:{' '}
                {product.quantity > 0 ? `${product.quantity}개 남음` : '품절'}
              </div>
            ))}
          </div>

          {/* 장바구니 아이템 */}
          <div id="cart-items">
            <CartItem addedItem={productData[0]} />
          </div>

          {/* 총액 표시 */}
          <div id="cart-total" className="text-xl font-bold my-4">
            <span id="cart-total-amount">총액: 0원</span>
            <span id="loyalty-points" className="text-blue-500 ml-2">
              (포인트: 0)
            </span>
            {/* 할인 */}
            <span id="discount-info" className="text-green-500 ml-2"></span>
          </div>
        </div>
      </div>
    </div>
  );
};
