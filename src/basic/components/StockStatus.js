import { STOCK_POLICY } from '../constants/policy';
import { products } from '../data/products';
import { getStockStatusElement } from '../utils/dom';
import { getRemainingQuantity, getStockMessage, isLowStock } from '../utils/stock';

const StockStatus = ({ product, cartItem }) => {
  const quantity = getRemainingQuantity(product, cartItem);

  return isLowStock(quantity, STOCK_POLICY.STOCK_THRESHOLD) ? `${product.name}: ${getStockMessage(quantity)}` : '';
};

export default StockStatus;

export const renderStockStatus = () => {
  getStockStatusElement().innerHTML = products
    .map((product) =>
      StockStatus({
        product,
        cartItem: cartStore.getCartItem(product.id),
      }),
    )
    .filter((text) => text !== '')
    .join('\n');
};
