import React from 'react';
import { Product } from '../type';
import { CURRENCY, ID_BY_COMPONENT } from '../const';

interface SelectProps {
  productList: Product[];
}

const Select: React.FC<SelectProps> = ({ productList }) => {
  return (
    <select id={ID_BY_COMPONENT.SELECT_ID} className="border rounded p-2 mr-2">
      {productList.map((item) => (
        <option key={item.id} value={item.id} disabled={!item.qty}>
          {item.name} - {item.val}
          {CURRENCY}
        </option>
      ))}
    </select>
  );
};

export default Select;
