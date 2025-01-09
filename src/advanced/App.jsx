import React, { useState } from "react";
import CartDisplay from "./components/CartDisplay";
import ProductSelector from "./components/ProductSelector";
import StockInfo from "./components/StockInfo";
import DiscountMessage from "./components/DiscountMessage";
import useCalculations from "./hooks/useCalculations";
import useEventSale from "./hooks/useEventSale";
import useRecommendations from "./hooks/useRecommendations";
import useCartActions from "./hooks/useCartActions";
import { initialProductList } from "./config/constans";

const App = () => {
  const [products, setProducts] = useState(initialProductList);
  
  const { 
    cartItems, 
    lastPickProduct, 
    addToCart, 
    updateCartQuantity, 
  } = useCartActions(products, setProducts);

  const { totalAmount, bonusPoints, discountStatus } = useCalculations(cartItems, products);

  useEventSale(products, setProducts);
  useRecommendations(products, setProducts, lastPickProduct);

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