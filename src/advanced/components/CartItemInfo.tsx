interface CartItemInfoProps {
  name: string;
  price: number;
  quantity: number;
}

export function CartItemInfo({ name, price, quantity }: CartItemInfoProps) {
  return (
    <span>
      {name} - {price}원 x {quantity}
    </span>
  );
}
