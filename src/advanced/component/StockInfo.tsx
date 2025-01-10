import React from 'react';

import { useGlobalContext } from '../context';

const StockInfo: React.FC = () => {
  const { values } = useGlobalContext();
  const { productList, cartItemList } = values;

  return (
    <div className="text-sm text-gray-500 mt-2">
      {productList.map(({ id, name, qty }) => {
        const cartItem = cartItemList?.find((item) => item.id === id);
        const remainQty = qty - (cartItem?.qty ?? 0);

        if (remainQty > 5) return null;

        return (
          <div key={id}>
            {name}:&nbsp;
            {remainQty > 0 ? `재고 부족 (${remainQty}개 남음)` : '품절'}
          </div>
        );
      })}
    </div>
  );
};

export default StockInfo;
