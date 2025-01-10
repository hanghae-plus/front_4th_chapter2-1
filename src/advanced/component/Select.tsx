import React from 'react';
import { CURRENCY } from '../const';
import { useGlobalContext } from '../context';

const Select: React.FC = () => {
  const { values } = useGlobalContext();
  const { productList, randomDiscRateByProduct } = values;

  return (
    <select className="border rounded p-2 mr-2" name="item">
      {productList.map(({ id, name, qty, val }) => (
        <option key={id} value={id} disabled={!qty}>
          {name} - {Math.round(val * (1 - randomDiscRateByProduct[id]))}
          {CURRENCY}
        </option>
      ))}
    </select>
  );
};

export default Select;
