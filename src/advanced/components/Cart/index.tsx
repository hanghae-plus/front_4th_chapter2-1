import React, { useState, useEffect } from "react";
import { Product, CartItem, CartTotalList } from "../../types";
import ProductSelect from "../ProductSelect";
import CartItemList from "../CartItemList";
import CartSummary from "../CartSummary";
import { usePromotion } from "../../hooks/usePromotion";
import { calcTotalList } from "../../services/cartService";

interface CartProps {
  productList: Product[];
  setProductList: React.Dispatch<React.SetStateAction<Product[]>>;
}

const Cart: React.FC<CartProps> = ({ productList, setProductList }) => {
  const [cartItemList, setCartItemList] = useState<CartItem[]>([]);
  const [lastSelectedProduct, setLastSelectedProduct] = useState<string | null>(
    null
  );
  const [totalList, setTotalList] = useState<CartTotalList>({
    subTotal: 0,
    totalAmt: 0,
    itemCnt: 0,
    discount: 0,
  });

  usePromotion(productList, setProductList, lastSelectedProduct);

  useEffect(() => {
    const newTotalList = calcTotalList(cartItemList, productList);
    setTotalList(newTotalList);
  }, [cartItemList, productList]);

  const handleAddToCart = (productId: string) => {
    const product = productList.find((p) => p.id === productId);
    if (!product || product.stock <= 0) return;

    setProductList((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: p.stock - 1 } : p))
    );

    setCartItemList((prev) => {
      const existingItem = prev.find((item) => item.id === productId);
      if (existingItem) {
        return prev.map((item) =>
          item.id === productId ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id: productId, qty: 1 }];
    });

    setLastSelectedProduct(productId);
  };

  const handleUpdateQty = (productId: string, change: number) => {
    const product = productList.find((p) => p.id === productId);
    if (!product) return;

    if (change > 0 && product.stock <= 0) {
      alert("재고가 부족합니다.");
      return;
    }

    setProductList((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: p.stock - change } : p
      )
    );

    setCartItemList((prev) => {
      const updatedItemList = prev
        .map((item) =>
          item.id === productId ? { ...item, qty: item.qty + change } : item
        )
        .filter((item) => item.qty > 0);

      return updatedItemList;
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      <ProductSelect
        productList={productList}
        handleAddToCart={handleAddToCart}
      />
      <CartItemList
        itemList={cartItemList}
        productList={productList}
        handleUpdateQty={handleUpdateQty}
      />
      <CartSummary totalList={totalList} />
    </div>
  );
};

export default Cart;
