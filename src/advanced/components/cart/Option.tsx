import React from 'react';

interface OptionProps {
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemQuantity: number;
}

export const Option = ({ itemId, itemName, itemPrice, itemQuantity }: OptionProps) => {
  const isSoldOut = itemQuantity === 0;

  return (
    <option value={itemId} disabled={isSoldOut}>
      {itemName} - {itemPrice}원
    </option>
  );
};
