import React from "react";
import { combineStyles } from "../../../../../utils";

interface CartItemButtonsProps {
  onIncrease: () => void;
  onDecrease: () => void;
  onDelete: () => void;
}

const CartItemButtons: React.FC<CartItemButtonsProps> = ({
  onIncrease,
  onDecrease,
  onDelete,
}) => {
  const buttonStyles = combineStyles(
    "px-2",
    "py-1",
    "mx-1",
    "rounded",
    "text-white"
  );
  const actionButtonStyles = combineStyles(buttonStyles, "bg-blue-500");
  const deleteButtonStyles = combineStyles(buttonStyles, "bg-red-500");

  return (
    <div>
      <button
        className={actionButtonStyles}
        data-change="-1"
        onClick={onDecrease}
      >
        -
      </button>
      <button
        className={actionButtonStyles}
        data-change="1"
        onClick={onIncrease}
      >
        +
      </button>
      <button className={deleteButtonStyles} onClick={onDelete}>
        삭제
      </button>
    </div>
  );
};

export default CartItemButtons;
