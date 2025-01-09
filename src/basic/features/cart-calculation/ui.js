import { getProductDiscount } from '../../entities/discount/lib.js';
import { CRITERIA } from '../../entities/discount/config.js';

const extractQuantity = (cartItem) => {
  const [, quantityStr] = cartItem
    .querySelector('span')
    .textContent.split('x ');
  return parseInt(quantityStr);
};

export const calculateCartItemValues = (product, cartItem) => {
  const quantity = extractQuantity(cartItem);
  const productAmount = product.price * quantity;
  const discount = getProductDiscount(
    product.id,
    quantity >= CRITERIA.DISCOUNT
  );

  return { quantity, productAmount, discount };
};
