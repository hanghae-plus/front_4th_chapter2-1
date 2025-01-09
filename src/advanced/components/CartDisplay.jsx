import React from "react";
/**
 * CartDisplay
 * - cartItems: 장바구니에 담긴 상품 정보, 각 상품의 Id를 키로 하는 객체
 * - updateQuantity: 장바구니에 담긴 상품의 수량 업데이트 함수
 */
const CartDisplay = ({ cartItems, updateQuantity }) => {
  // 장바구니가 비어있다면 메세지 표시
  if (Object.keys(cartItems).length === 0) {
    return <div className="text-gray-500 my-4">장바구니가 비어있습니다.</div>;
  }

  // 장바구니에 상품이 있을 경우 목록 표시. 스타일 약간 변경함
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