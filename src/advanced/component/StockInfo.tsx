import React, { useMemo } from 'react';
import { ID_BY_COMPONENT } from '../const';
import { Product } from '../type';

interface StockInfoProps {
  productList: Product[];
}

const StockInfo: React.FC<StockInfoProps> = ({ productList }) => {
  const productToInform = useMemo(
    () => productList.filter((product) => product.qty < 5),
    [productList],
  );

  return (
    <div
      id={ID_BY_COMPONENT.STOCK_INFO_ID}
      className="text-sm text-gray-500 mt-2"
    >
      {productToInform.map(
        ({ name, qty }) =>
          `${name}: ${qty > 0 ? `재고 부족 (${qty}개 남음)` : '품절'}\n`,
      )}
    </div>
  );
};

export default React.memo(StockInfo);
