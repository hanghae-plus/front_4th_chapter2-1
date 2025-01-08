import React, { useState, useEffect } from "react";
import CartDisplay from "./components/CartDisplay";
import ProductSelector from "./components/ProductSelector";
import StockInfo from "./components/StockInfo";
import DiscountMessage from "./components/DiscountMessage";
import useCalculations from "./hooks/useCalculations";
import useEventSale from "./hooks/useEventSale";

import { CONSTANTS, initialProductList } from "./config/constans";

const App = () => {
  const [products, setProducts] = useState(initialProductList);
  const [cartItems, setCartItems] = useState({});
  const [lastPickProduct, setLastPickProduct] = useState(null);

  const { totalAmount, bonusPoints, discountStatus } = useCalculations(cartItems, products);

  useEventSale()

  const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.quantity <= 0) return;

    setCartItems(prev => {
      const currentQuantity = prev[productId]?.quantity || 0;
      return {
        ...prev,
        [productId]: {
          ...product,
          quantity: currentQuantity + 1
        }
      };
    });

    setProducts(prev =>
      prev.map(p =>
        p.id === productId
        ? { ...p, quantity: p.quantity - 1}
        : p
      )
    );

    setLastPickProduct(productId);
  };

  const updateCartQuantity = (productId, change) => {
    const product = products.find(p => p.id === productId);
    const currentQuantity = cartItems[productId]?.quantity || 0
    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {
      const { [productId]: removed, ...rest } = cartItems;
      setCartItems(rest);
      setProducts(prev =>
        prev.map(p =>
          p.id === productId
          ? { ...p, quantity: p.quantity + currentQuantity }
          : p
        )
      );
    } else if (change > 0 && product.quantity <= 0) {
      alert("재고가 부족합니다");
    } else {
      setCartItems(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: newQuantity
        }
      }));
      setProducts(prev =>
        prev.map(p =>
          p.id === productId
          ? { ...p, quantity: p.quantity - change }
          : p
        )
      );
    }
  };

  const getQuantityDiscount = (productId) => {
    const discountRates = {
      p1: 0.1,
      p2: 0.15,
      p3: 0.2,
      p4: 0.05,
      p5: 0.25,
    };
    return discountRates[productId] || 0;
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <CartDisplay cartItems={cartItems} updateQuantity={updateCartQuantity} />
        <div className="text-xl font-bold my-4">
          총액: {totalAmount.toLocaleString()}원
          <span className="text-blue-500 ml-2">(포인트: {bonusPoints.toLocaleString()})</span>
          <DiscountMessage discountStatus={discountStatus} />
        </div>
        <ProductSelector products={products} onAdd={addToCart} />
        <StockInfo products={products} />
      </div>
    </div>
  );
}

export default App;