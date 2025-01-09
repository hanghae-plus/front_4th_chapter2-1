import React from "react";
import { useCart } from "../../../../../contexts/CartContext";
import { useProduct } from "../../../../../contexts/ProductContext";
import { combineStyles } from "../../../../../utils";

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
  const buttonStyles = combineStyles(
    "px-2",
    "py-1",
    "mx-1",
    "rounded",
    "text-white"
  );
  const quantityButtonStyles = combineStyles(buttonStyles, "bg-blue-500");
  const removeButtonStyles = combineStyles(buttonStyles, "bg-red-500");

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity <= 0) {
      // 상품 제거
      const newItems = cartState.items.filter((item) => item.id !== id);
      setCartState((prev) => ({
        ...prev,
        items: newItems,
        lastSelected: id,
      }));
    } else if (newQuantity <= (product?.stock ?? 0)) {
      // 수량 변경
      const newItems = cartState.items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      setCartState((prev) => ({
        ...prev,
        items: newItems,
        lastSelected: id,
      }));
    } else {
      alert("재고가 부족합니다");
    }
  };

  const handleRemove = () => {
    const newItems = cartState.items.filter((item) => item.id !== id);
    setCartState((prev) => ({
      ...prev,
      items: newItems,
      lastSelected: id,
    }));
  };

  return (
    <div id={id} className={itemStyles}>
      <span>{`${product.name} - ${product.price}원 x ${quantity}`}</span>
      <div>
        <button
          className={quantityButtonStyles}
          onClick={() => handleQuantityChange(-1)}
          data-change="-1"
        >
          -
        </button>
        <button
          className={quantityButtonStyles}
          onClick={() => handleQuantityChange(1)}
          data-change="1"
        >
          +
        </button>
        <button className={removeButtonStyles} onClick={handleRemove}>
          삭제
        </button>
      </div>
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
