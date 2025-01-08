import { isOutOfStock } from '../../entities/stock/model.js';
import { formatProductOption } from '../../entities/product/lib.js';

export const prepareProductOptions = (products) => {
  return products.map((product) => ({
    ...formatProductOption(product),
    disabled: isOutOfStock(product),
  }));
};
