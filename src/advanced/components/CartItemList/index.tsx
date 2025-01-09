import React from 'react';
import { Product, CartItem } from '../../types';

interface CartItemListProps {
  items: CartItem[];
  products: Product[];
  onUpdateQuantity: (productId: string, change: number) => void;
}

const CartItemList: React.FC<CartItemListProps> = ({
  items,
  products,
  onUpdateQuantity,
}) => {
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) return null;

        return (
          <div
            key={item.id}
            className="flex justify-between items-center p-2 border rounded"
          >
            <span>
              {product.name} - {product.price}원 x {item.quantity}
            </span>
            <div className="space-x-2">
              <button
                className="px-2 py-1 border rounded"
                onClick={() => onUpdateQuantity(item.id, -1)}
              >
                -
              </button>
              <button
                className="px-2 py-1 border rounded"
                onClick={() => onUpdateQuantity(item.id, 1)}
              >
                +
              </button>
              <button
                className="px-2 py-1 border rounded text-red-500"
                onClick={() => onUpdateQuantity(item.id, -item.quantity)}
              >
                삭제
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartItemList;