import React, { useState, useEffect } from "react";
import { Product, CartItem, CartTotalList } from "../../types";
import ProductSelect from "../ProductSelect";
import CartItemList from "../CartItemList";
import CartSummary from "../CartSummary";
import { usePromotion } from "../../hooks/usePromotion";
import { calculateTotalList } from "../../services/cartService";

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
    totalAmount: 0,
    itemCount: 0,
    discount: 0,
  });

  usePromotion(productList, setProductList, lastSelectedProduct);

  useEffect(() => {
    const newTotalList = calculateTotalList(cartItemList, productList);
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
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: productId, quantity: 1 }];
    });

    setLastSelectedProduct(productId);
  };

  const handleUpdateQuantity = (productId: string, change: number) => {
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
          item.id === productId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0);

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
        handleUpdateQuantity={handleUpdateQuantity}
      />
      <CartSummary totalList={totalList} />
    </div>
  );
};

export default Cart;
