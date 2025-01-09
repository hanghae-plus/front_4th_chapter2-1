export const getStockMessage = (quantity: number) => {
  return quantity > 0 ? `재고 부족 (${quantity}개 남음)` : '품절';
};

export const getRemainingQuantity = ({
  productQuantity,
  cartQuantity,
}: {
  productQuantity: number;
  cartQuantity: number;
}) => {
  return cartQuantity ? productQuantity - cartQuantity : productQuantity;
};

export const isLowStock = ({ quantity, threshold }: { quantity: number; threshold: number }) => {
  return quantity < threshold;
};
