export const getStockMessage = (quantity) => {
  return quantity > 0 ? `재고 부족 (${quantity}개 남음)` : '품절';
};

export const getRemainingQuantity = (product, cartItem) => {
  return cartItem ? product.quantity - cartItem.getQuantity() : product.quantity;
};

export const isLowStock = (quantity, threshold) => {
  return quantity < threshold;
};
