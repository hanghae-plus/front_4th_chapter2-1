interface CartDisplayProps {
  onClick?: () => void;
}

export function CartDisplay({ onClick }: CartDisplayProps) {
  return <div id="cart-items" onClick={onClick}></div>;
}
