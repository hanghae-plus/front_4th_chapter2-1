import React from "react";

interface AddButtonProps {
  onClick: () => void;
}

export default function AddButton(props: AddButtonProps) {
  const { onClick } = props;
  return (
    <button
      id="add-to-cart"
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={onClick}
    >
      추가
    </button>
  );
}
