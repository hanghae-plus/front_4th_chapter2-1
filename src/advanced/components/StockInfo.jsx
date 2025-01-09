import React from "react";
import { CONSTANTS } from "../config/constans";

/**
 * StockInfo
 * - products: 상품 목록을 포함하는 배열. 상품은 id, name, quantity 속성을 가짐
 */
const StockInfo = ({ products }) => {
  // LOW_STOCK_THRESHOLD(5) 미만의 재고를 가진 상품 필터링
  const lowStockItems = products.filter(
    item => item.quantity < CONSTANTS.LOW_STOCK_THRESHOLD
  );

  // 재고 부족 상품이 없으면 아무것도 렌더링하지 않음
  if (lowStockItems.length === 0){
    return null;
  }

  return (
    <div className="mt-4 p-2 bg-yellow-50 rounded">
      <h2 className="font-semibold text-yellow-800 mb-2">재고 현황</h2>
      {lowStockItems.map(item => (
        <div key={item.id} className="text-sm text-yellow-700">
          {item.name}: {item.quantity > 0
            ? `재고 부족 (${item.quantity}개 남음)`
            : "품절"}
        </div>
      ))}
    </div>
  );
};

export default StockInfo;