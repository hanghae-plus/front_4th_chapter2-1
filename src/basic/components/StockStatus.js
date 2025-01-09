import { STOCK_POLICY } from '../constants/policy';
import { getRemainingQuantity, getStockMessage, isLowStock } from '../utils/stock';

const StockStatus = ({ product, cartItem }) => {
  const quantity = getRemainingQuantity(product, cartItem);

  return isLowStock(quantity, STOCK_POLICY.STOCK_THRESHOLD) ? `${product.name}: ${getStockMessage(quantity)}` : '';
};

export default StockStatus;
