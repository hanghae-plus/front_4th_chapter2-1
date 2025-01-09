import { getRemainingQuantity, getStockMessage, isLowStock } from '@/services/stock';
import type { Cart } from '@/types/cart.type';
import type { Product } from '@/types/product.type';

import { STOCK_POLICY } from '../constants/policy';

interface StockStatusProps {
  product: Product;
  cartItems: Cart[];
}

const StockStatus = ({ product, cartItems }: StockStatusProps) => {
  const cartQuantity = cartItems?.find((item) => item.productId === product.id)?.quantity ?? 0;
  const quantity = getRemainingQuantity({ productQuantity: product.quantity, cartQuantity });

  return isLowStock({ quantity, threshold: STOCK_POLICY.STOCK_THRESHOLD }) ? (
    <div className="text-sm text-gray-500 mt-2">
      {product.name}: {getStockMessage(quantity)}
    </div>
  ) : null;
};

export default StockStatus;
