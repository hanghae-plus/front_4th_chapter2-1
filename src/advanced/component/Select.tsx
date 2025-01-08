import React from 'react';
import { Product } from '../type';
import { CURRENCY, ID_BY_COMPONENT } from '../const';

interface SelectProps {
  productList: Product[];
  randomDiscRateByProduct: Record<string, number>;
}

const Select: React.FC<SelectProps> = ({
  productList,
  randomDiscRateByProduct,
}) => {
  return (
    <select
      id={ID_BY_COMPONENT.SELECT_ID}
      className="border rounded p-2 mr-2"
      name="item"
    >
      {productList.map(({ id, name, qty, val }) => (
        <option key={id} value={id} disabled={!qty}>
          {name} - {val * (1 - randomDiscRateByProduct[id])}
          {CURRENCY}
        </option>
      ))}
    </select>
  );
};

export default React.memo(Select);
