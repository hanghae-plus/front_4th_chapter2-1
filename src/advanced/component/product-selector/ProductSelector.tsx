import { useState } from 'react';

import { SelectOption } from './_components/SelectOption';
import { useAddCartItem, useGetCartList } from '../../contexts/cart-context/CartProvider';
import { useDecreaseQuantity, useGetProductList } from '../../contexts/product-context/ProductProvider';
import { useQuantityCountChecker } from '../../hooks/useQuantityCountChecker';

import type { Product } from '../../types/product';
import type { ChangeEvent } from 'react';

export const ProductSelector = () => {
  const addCartItem = useAddCartItem();
  const productList = useGetProductList();
  const cartList = useGetCartList();
  const decreaseQuantity = useDecreaseQuantity();

  const { isQuantityCountOver } = useQuantityCountChecker();

  const [selectedItem, setSelectedItem] = useState<Product>(productList[0]);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const targetId = event.target.value;

    const targetItem = productList.find((product) => product.id === targetId);

    if (!targetItem) return;

    setSelectedItem(targetItem);
  };

  const handleAddButtonClick = () => {
    const matchedCartItem = cartList.find((item) => item.id === selectedItem.id);

    if (matchedCartItem && isQuantityCountOver(selectedItem, matchedCartItem.quantity)) {
      return;
    }

    addCartItem(selectedItem);
    decreaseQuantity(selectedItem.id);
  };

  return (
    <>
      <select
        id="product-select"
        className="border rounded p-2 mr-2"
        onChange={handleSelectChange}
        value={selectedItem.id}
      >
        {productList.map((product) => (
          <SelectOption key={product.id} product={product} />
        ))}
      </select>
      <button id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddButtonClick}>
        추가
      </button>
    </>
  );
};
