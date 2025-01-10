import React from 'react';
import { useGlobalContext } from '../context';

interface AddBtnProps {
  setLastSelectedId: (id: string) => void;
}
const AddBtn: React.FC<AddBtnProps> = ({ setLastSelectedId }) => {
  const { values, actions } = useGlobalContext();
  const { cartItemList } = values;
  const { addCartItem, editCartItem } = actions;

  const handleClickAddBtn = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    const tgtId = e.target?.form?.item?.value;
    const existingItem = cartItemList.find(({ id }) => id === tgtId);

    if (existingItem) {
      editCartItem(existingItem.id, existingItem.qty + 1);
    } else {
      addCartItem(tgtId);
    }

    setLastSelectedId(tgtId);
  };

  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded"
      type="submit"
      onClick={handleClickAddBtn}
    >
      추가
    </button>
  );
};

export default AddBtn;
