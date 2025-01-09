import React from 'react';
import { Product } from '../types'; // Product 타입은 프로젝트에 맞게 정의

interface StockStatusProps {
  products: Product[];
}

export const StockStatus: React.FC<StockStatusProps> = ({ products }) => {
  const lowStockThreshold = 5; // 재고 부족 기준

  // 재고 상태 메시지 생성
  const getStockMessage = (product: Product) => {
    if (product.quantity === 0) {
      return `${product.name}: 품절`;
    }
    if (product.quantity < lowStockThreshold) {
      return `${product.name}: 재고 부족 (${product.quantity}개 남음)`;
    }
    return null;
  };

  const stockMessages = products
    .map(getStockMessage)
    .filter((message): message is string => !!message); // null 값 제거

  return (
    <div className='mt-4'>
      <h2 className='text-lg font-semibold mb-2'>재고 상태</h2>
      {stockMessages.length > 0 ? (
        <ul className='text-sm text-gray-700'>
          {stockMessages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      ) : (
        <p className='text-sm text-green-500'>모든 상품의 재고가 충분합니다.</p>
      )}
    </div>
  );
};
