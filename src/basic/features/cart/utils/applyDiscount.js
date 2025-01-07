export const applyDiscount = ({ amount, discountRate }) => {
  return amount * (1 - discountRate);
};
