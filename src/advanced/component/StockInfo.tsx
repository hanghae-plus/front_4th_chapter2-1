import React, { useMemo } from 'react';
import { ID_BY_COMPONENT } from '../const';
import { CartItem, Product } from '../type';

interface StockInfoProps {
  productList: Product[];
  cartItemList: CartItem[];
}

const StockInfo: React.FC<StockInfoProps> = ({ productList, cartItemList }) => {
  return (
    <div
      id={ID_BY_COMPONENT.STOCK_INFO_ID}
      className="text-sm text-gray-500 mt-2"
    >
      {productList.map(({ id, name, qty }) => {
        const cartItem = cartItemList?.find((item) => item.id === id);
        const remainQty = qty - (cartItem?.qty ?? 0);

        if (remainQty > 5) return null;

        return (
          <div>
            {name}:&nbsp;
            {remainQty > 0 ? `재고 부족 (${remainQty}개 남음)` : '품절'}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(StockInfo);
