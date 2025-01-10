import React from 'react';
import { CURRENCY, ID_BY_COMPONENT } from '../const';
import { useGlobalContext } from '../context';

const Select: React.FC = () => {
  const { values } = useGlobalContext();
  const { productList, randomDiscRateByProduct } = values;

  return (
    <select
      id={ID_BY_COMPONENT.SELECT_ID}
      className="border rounded p-2 mr-2"
      name="item"
    >
      {productList.map(({ id, name, qty, val }) => (
        <option key={id} value={id} disabled={!qty}>
          {name} - {Math.round(val * (1 - randomDiscRateByProduct[id]))}
          {CURRENCY}
        </option>
      ))}
    </select>
  );
};

export default React.memo(Select);
