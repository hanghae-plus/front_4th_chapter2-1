import React, { useState } from "react";
import ShoppingCart from "../components/ShoppingCart";
import CartTotalCost from "../components/CartTotalCost";
import ProductOptions from "../components/ProductOptions";
import AddButton from "../components/AddButton";
import StockStatus from "../components/StockStatus";
import { itemList } from "../constants/constants";
import { IItem } from "../types/types";

export default function MainContents() {
  const [cart, setCart] = useState<IItem[]>([]);
  const [inventory, setInventory] = useState<IItem[]>(itemList);
  const [selectedItemId, setSelectedItemId] = useState<IItem["id"]>(
    itemList.find((item) => (item.id = "p1")).id,
  );
  const [totalCost, setTotalCost] = useState<number>(0);
  const [bonus, setBonus] = useState<number>(0);

  const handleAddItem = () => {
    const itemToAdd: IItem = inventory.find((p) => p.id === selectedItemId);

    if (cart.find((item) => item.id === selectedItemId)?.qty >= itemToAdd.qty) {
      alert("재고가 부족합니다.");
      return;
    }
    if (!itemToAdd || itemToAdd.qty <= 0) {
      alert("재고가 부족합니다.");
      return;
    }

    setCart((prevCart: IItem[]) => {
      const existingItem = prevCart.find((item) => item.id === selectedItemId);

      if (existingItem) {
        return prevCart.map((item: IItem) =>
          item.id === selectedItemId ? { ...item, qty: item.qty + 1 } : item,
        );
      }

      return [
        ...prevCart,
        {
          ...itemToAdd,
          qty: 1,
        },
      ];
    });

    setInventory((prevInventory: IItem[]) =>
      prevInventory.map((item) =>
        item.id === selectedItemId ? { ...item, qty: item.qty - 1 } : item,
      ),
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      <ShoppingCart
        cart={cart}
        setCart={setCart}
        inventory={inventory}
        setInventory={setInventory}
      />
      <CartTotalCost
        totalCost={totalCost}
        setTotalCost={setTotalCost}
        bonus={bonus}
        setBonus={setBonus}
        cart={cart}
      />
      <ProductOptions setSelectedItemId={setSelectedItemId} />
      <AddButton onClick={handleAddItem} />
      <StockStatus inventory={inventory} />
    </div>
  );
}
