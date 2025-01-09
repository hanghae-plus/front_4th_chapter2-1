import { Product, CartItem as CartItemType } from "../../types/cart";
import { CartItem } from "./CartItem";

interface CartListProps {
  items: CartItemType[];
  products: Product[];
  onQuantityChange: (productId: string, change: number) => void;
  onRemove: (productId: string) => void;
}

export function CartList({
  items,
  products,
  onQuantityChange,
  onRemove,
}: CartListProps) {
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;

        return (
          <CartItem
            key={item.productId}
            product={product}
            quantity={item.quantity}
            onQuantityChange={(change) =>
              onQuantityChange(item.productId, change)
            }
            onRemove={() => onRemove(item.productId)}
          />
        );
      })}
    </div>
  );
}
