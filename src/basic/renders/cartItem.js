export const createCartItemElement = ({ cartItem }) => {
  const $cartItem = document.createElement('div');
  $cartItem.id = cartItem.id;
  $cartItem.className = 'flex justify-between items-center mb-2';
  $cartItem.innerHTML = `
    <span>${cartItem.name} - ${cartItem.price}원 x ${cartItem.quantity}</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${cartItem.id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${cartItem.id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${cartItem.id}">삭제</button>
    </div>
  `;

  return $cartItem;
};
