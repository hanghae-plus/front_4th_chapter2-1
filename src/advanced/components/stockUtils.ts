export const formatMessage = (quantity: number) => {
  return quantity === 0 ? '품절' : `재고 부족 (${quantity}개 남음)`;
};