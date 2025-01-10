// src/components/CartItem.js
import { Button } from './common/';
import { Product } from '../shares/types';

interface CartItemProps {
  product: Product;
  quantity: number;
  onRemove: () => void;
}

export function CartItem({ product, quantity, onRemove }: CartItemProps) {
  // TODO : onUPdate 함수 구현
  const onUpdate = (amount: number) => {
    console.log('onUpdate', amount);
  };

  return (
    <div className="flex justify-between items-center mb-2">
      <span>
        {product.name} - {product.val.toLocaleString()}원 x {quantity}
      </span>
      <div>
        <Button className="bg-blue-500 text-white mr-1" onClick={() => onUpdate(-1)}>
          -
        </Button>
        <Button className="bg-blue-500 text-white mr-1" onClick={() => onUpdate(1)}>
          +
        </Button>
        <Button className="bg-red-500 text-white" onClick={onRemove}>
          삭제
        </Button>
      </div>
    </div>
  );
}
