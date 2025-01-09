export const Option = ({ itemId, itemName, itemPrice, itemQuantity, lastSelectedProductId }) => {
  const isSoldOut = itemQuantity === 0;
  const isSelect = itemId === lastSelectedProductId;

  return `<option value="${itemId}" ${isSoldOut ? 'disabled' : null} ${isSelect ? 'selected' : ''}>${itemName} - ${itemPrice}원</option>`;
};
