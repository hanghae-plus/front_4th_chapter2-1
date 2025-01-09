import { Product } from "@advanced/entities/product";

interface CartItemProps extends Product {
  onAdd: (product: Product) => void;
  onRemove: (productId: string) => void;
  onDelete: (roductId: string) => void;
}

export function CartItem({
  id,
  name,
  cost,
  quantity,
  onAdd,
  onDelete,
  onRemove
}: CartItemProps) {
  return (
    <div className="flex justify-between items-center mb-2">
      <span>
        {name} - {cost}원 x {quantity}
      </span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => onRemove(id)}
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => onAdd({ id, name, cost, quantity })}
        >
          +
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => onDelete(id)}
        >
          삭제
        </button>
      </div>
    </div>
  );
}
