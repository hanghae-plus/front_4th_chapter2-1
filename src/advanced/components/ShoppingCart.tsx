import React, { Dispatch, SetStateAction, useState } from "react";
import { itemList } from "../constants/constants";
import { IItem } from "../types/types";

interface ShoppingCartProps {
  cart: IItem[];
  setCart: Dispatch<SetStateAction<IItem[]>>;
  inventory: IItem[];
  setInventory: Dispatch<SetStateAction<IItem[]>>;
}

export default function ShoppingCart(props: ShoppingCartProps) {
  const { cart, setCart, inventory, setInventory } = props;
  const handleQuantityChange = (productId: IItem["id"], change: number) => {
    setCart((prevCart: IItem[]) => {
      const inventoryItem = inventory.find((p) => p.id === productId);
      if (change > 0 && inventoryItem.qty <= 0) {
        alert("재고가 부족합니다.");
        return prevCart;
      }
      const item = prevCart.find((item: IItem) => item.id === productId);
      if (!item) return prevCart;

      const newQuantity = item.qty + change;

      if (newQuantity <= 0) {
        setInventory((prevInventory: IItem[]) =>
          prevInventory.map((invItem: IItem) =>
            invItem.id === productId
              ? { ...invItem, qty: invItem.qty + item.quantity }
              : invItem,
          ),
        );
        return prevCart.filter((item: IItem) => item.id !== productId);
      }

      setInventory((prevInventory: IItem[]) =>
        prevInventory.map((item: IItem) =>
          item.id === productId ? { ...item, qty: item.qty - change } : item,
        ),
      );

      return prevCart.map((item: IItem) =>
        item.id === productId ? { ...item, qty: newQuantity } : item,
      );
    });
  };

  const handleRemoveItem = (itemId: IItem["id"]) => {
    setCart((prevCart: IItem[]) => {
      const removedItem = prevCart.find((item) => item.id === itemId);
      if (removedItem) {
        setInventory((prevInventory: IItem[]) =>
          prevInventory.map((item: IItem) =>
            item.id === itemId
              ? { ...item, qty: item.qty + removedItem.quantity }
              : item,
          ),
        );
      }
      return prevCart.filter((item: IItem) => item.id !== itemId);
    });
  };

  return (
    <div id="cart-items">
      {cart.map((item: IItem) => (
        <div key={item.id} className="flex justify-between items-center mb-2">
          <span>
            {item.name} - {item.price}원 x {item.qty}
          </span>
          <div>
            <button
              className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
              onClick={() => handleQuantityChange(item.id, -1)}
            >
              -
            </button>
            <button
              className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
              onClick={() => handleQuantityChange(item.id, 1)}
            >
              +
            </button>
            <button
              className="remove-item bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => handleRemoveItem(item.id)}
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
