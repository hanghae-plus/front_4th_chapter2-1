import React from "react";
import { useCart } from "../../../../../contexts/CartContext";
import { useProduct } from "../../../../../contexts/ProductContext";
import { combineStyles } from "../../../../../utils";
import CartItemButtons from "./CartItemButtons";

interface CartItemProps {
  id: string;
  quantity: number;
}

const CartItemComponent: React.FC<CartItemProps> = ({ id, quantity }) => {
  const { productState } = useProduct();
  const { cartState, setCartState } = useCart();

  const product = productState.products.find((p) => p.id === id);
  if (!product) return null;

  const itemStyles = combineStyles(
    "flex",
    "justify-between",
    "items-center",
    "mb-2"
  );

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity <= 0) {
      handleDelete();
      return;
    }

    if (change > 0 && product.stock < newQuantity) {
      alert("재고가 부족합니다");
      return;
    }

    setCartState((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ),
    }));
  };

  const handleDelete = () => {
    setCartState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  return (
    <div id={id} className={itemStyles}>
      <span>{`${product.name} - ${product.price}원 x ${quantity}`}</span>
      <CartItemButtons
        onIncrease={() => handleQuantityChange(1)}
        onDecrease={() => handleQuantityChange(-1)}
        onDelete={handleDelete}
      />
    </div>
  );
};

const CartItem = () => {
  const { cartState } = useCart();

  return (
    <div id="cart-items">
      {cartState.items.map((item) => (
        <CartItemComponent
          key={item.id}
          id={item.id}
          quantity={item.quantity}
        />
      ))}
    </div>
  );
};

export default CartItem;
