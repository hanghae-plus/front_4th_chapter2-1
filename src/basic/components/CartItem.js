export const CartItem = ({ cartItem }) => {
  // onIncreaseClick, onDecreaseClick, onRemoveItemClick 이벤트 props로 받기

  return `
    <div id="${cartItem.id}" class="flex justify-between items-center mb-2">
      <span>${cartItem.name} - ${cartItem.price}원 x ${cartItem.quantity}</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${cartItem.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${cartItem.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${cartItem.id}">삭제</button>
      </div>
    </div>
  `;
};
