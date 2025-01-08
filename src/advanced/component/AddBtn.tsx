import React, { RefObject, useCallback } from 'react';
import { CartItem, Product } from '../type';
import { ID_BY_COMPONENT } from '../const';

interface AddBtnProps {
  cartItemList: CartItem[];
  productList: Product[];
  setCartItemList: (prev: CartItem[]) => void;
  lastSelId: RefObject<string | null>;
}

const AddBtn: React.FC<AddBtnProps> = ({
  productList,
  cartItemList,
  setCartItemList,
  lastSelId,
}) => {
  const handleClickAddBtn = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      const tgtId = e.target?.form?.item?.value;

      const product = productList.find(({ id }) => id === tgtId);

      console.log(`tgtId ${tgtId}`);
      console.log(product);

      if (!product) {
        throw Error('Selected cart item is not in the product list.');
      }

      const existingItem = cartItemList.find(({ id }) => id === tgtId);

      const newQty = (existingItem?.qty ?? 0) + 1;

      // 선택된 아이템의 재고가 없는 경우
      if (product.qty <= newQty) return alert('재고가 없습니다.');

      const newList = existingItem
        ? // 선택된 아이템이 이미 장바구니에 추가된 경우
          cartItemList.map((item) =>
            item.id === tgtId ? { id: item.id, qty: item.qty + 1 } : item,
          )
        : // 선택된 아이템을 새로 장바구니에 추가하는 경우
          [...cartItemList, { id: tgtId, qty: 1 }];

      setCartItemList(newList);
      lastSelId.current = tgtId;
    },
    [cartItemList],
  );

  return (
    <button
      id={ID_BY_COMPONENT.ADD_BTN_ID}
      className="bg-blue-500 text-white px-4 py-2 rounded"
      type="submit"
      onClick={handleClickAddBtn}
    >
      추가
    </button>
  );
};

export default React.memo(AddBtn);
