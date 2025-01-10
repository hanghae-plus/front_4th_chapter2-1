import React from "react";

interface ItemProps {
    id: string;
    name: string;
    price: number;
    quantity: number;
    onQuantityChange: (id: string, change: number) => void;
    onRemove: (id: string) => void;
}

const Items: React.FC<ItemProps> = ({ 
    id, 
    name, 
    price, 
    quantity, 
    onQuantityChange, 
    onRemove
}) => {
    return (
        <div id={id} className="flex justify-between items-center mb-2">
          <span>{`${name} - ${price}원 x ${quantity}`}</span>
          <div>
            <button
              className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
              data-product-id={id}
              onClick={() => onQuantityChange(id, -1)}
            >
              -
            </button>
            <button
              className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
              data-product-id={id}
              onClick={() => onQuantityChange(id, 1)}
            >
              +
            </button>
            <button
              className="remove-item bg-red-500 text-white px-2 py-1 rounded"
              data-product-id={id}
              onClick={() => onRemove(id)}
            >
              삭제
            </button>
          </div>
        </div>
    )
}

export default Items;