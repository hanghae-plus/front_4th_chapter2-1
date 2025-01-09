import React from "react";
import { Product, CartItem } from "../../types";

interface CartItemListProps {
  itemList: CartItem[];
  productList: Product[];
  handleUpdateQty: (productId: string, change: number) => void;
}

const CartItemList: React.FC<CartItemListProps> = ({
  itemList,
  productList,
  handleUpdateQty,
}) => {
  return (
    <div className="space-y-2">
      {itemList.map((item) => {
        const product = productList.find((p) => p.id === item.id);
        if (!product) return null;

        return (
          <div
            key={item.id}
            className="flex justify-between items-center p-2 border rounded"
          >
            <span>
              {product.name} - {product.price}원 x {item.qty}
            </span>
            <div className="space-x-2">
              <button
                className="px-2 py-1 border rounded"
                onClick={() => handleUpdateQty(item.id, -1)}
              >
                -
              </button>
              <button
                className="px-2 py-1 border rounded"
                onClick={() => handleUpdateQty(item.id, 1)}
              >
                +
              </button>
              <button
                className="px-2 py-1 border rounded text-red-500"
                onClick={() => handleUpdateQty(item.id, -item.qty)}
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
