import { Product } from "@advanced/entities/product";
import { Cart } from "../model";
import { CartItem } from "./CartItem";

interface CartDisplayProps {
  cart: Cart;
  onAdd: (product: Product) => void;
  onRemove: (productId: string) => void;
  onDelete: (productId: string) => void;
}

export function CartDisplay({
  cart,
  onAdd,
  onRemove,
  onDelete
}: CartDisplayProps) {
  return (
    <div id="cart-items">
      {cart.map((item) => (
        <CartItem
          key={item.id}
          {...item}
          onAdd={onAdd}
          onRemove={onRemove}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
