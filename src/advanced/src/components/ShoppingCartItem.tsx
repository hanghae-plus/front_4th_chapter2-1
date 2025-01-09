import { MouseEvent } from 'react';

import { useShoppingCart } from '../providers/ShoppingCartProvider.tsx';
import { Product } from '../types/product';

interface ShoppingCartItemProps {
  product: Product;
  totalQuantity: number;
}

const ShoppingCartItem = ({ product, totalQuantity }: ShoppingCartItemProps) => {
  const { addOneInCart, removeOneInCart, removeAllInCart } = useShoppingCart();

  const handleAddOneInCartButtonClick = (_e: MouseEvent<HTMLButtonElement>) => {
    addOneInCart(product.id);
  };

  const handleRemoveOneInCartButtonClick = (_e: MouseEvent<HTMLButtonElement>) => {
    removeOneInCart(product.id);
  };

  const handleRemoveAllInCartButtonClick = (_e: MouseEvent<HTMLButtonElement>) => {
    removeAllInCart(product.id);
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <span className="flex-1">
          {product.name} - {product.value}원 x {totalQuantity}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRemoveOneInCartButtonClick}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            -
          </button>
          <button
            onClick={handleAddOneInCartButtonClick}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            +
          </button>
          <button
            onClick={handleRemoveAllInCartButtonClick}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartItem;
