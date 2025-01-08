import React from "react";
import { CONSTANTS } from "../config/constans";

const StockInfo = ({ products }) => {
  const lowStockItems = products.filter(
    item => item.quantity < CONSTANTS.LOW_STOCK_THRESHOLD
  );

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