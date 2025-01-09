import { useEffect, useState } from 'react';
import { productList } from '../constant/product';

const StockStatus = () => {
  const [stockStatus, setStockStatus] = useState('');

  useEffect(() => {
    updateStockStatus();
  }, []);

  const updateStockStatus = () => {
    let stockStatusMessage = '';
    productList.forEach(function (product) {
      if (product.qty < 5) {
        stockStatusMessage +=
          product.name +
          ': ' +
          (product.qty > 0 ? `재고 부족 (${product.qty}개 남음) ` : '품절') +
          '\n';
      }
    });
    setStockStatus(stockStatusMessage);
  };

  return (
    <div id="stock-status" className="text-sm text-gray-500 mt-2">
      {stockStatus}
    </div>
  );
};

export default StockStatus;
