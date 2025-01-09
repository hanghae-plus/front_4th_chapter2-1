import { Product } from "../../types/cart";

interface CartItemProps {
  product: Product;
  quantity: number;
  onQuantityChange: (change: number) => void;
  onRemove: () => void;
}

export function CartItem({
  product,
  quantity,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex justify-between items-center mb-2 p-4 bg-white rounded shadow">
      <span>
        {product.name} - {product.val}원 x {quantity}
      </span>
      <div>
        <button
          onClick={() => onQuantityChange(-1)}
          className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
        >
          -
        </button>
        <button
          onClick={() => onQuantityChange(1)}
          className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
        >
          +
        </button>
        <button
          onClick={onRemove}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
