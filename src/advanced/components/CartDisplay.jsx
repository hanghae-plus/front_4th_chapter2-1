import React from "react";

const CartDisplay = ({ cartItems, updateQuantity }) => {
  if (Object.keys(cartItems).length === 0) {
    return <div className="text-gray-500 my-4">장바구니가 비어있습니다.</div>;
  }

  return (
    <div className="space-y-2">
      {Object.entries(cartItems).map(([id, item]) => (
        <div key={id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
        <span>{item.name} - {item.price.toLocaleString()}원 x {item.quantity}</span>
        <div className="flex gap-1">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
            onClick={() => updateQuantity(id, -1)}
          >
            -
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
            onClick={() => updateQuantity(id, 1)}
          >
            +
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
            onClick={() => updateQuantity(id, -item.quantity)}
          >
            삭제
          </button>
        </div>
      </div>
      ))}
    </div>
  );
}

export default CartDisplay;