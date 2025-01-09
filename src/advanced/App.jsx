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
  // 상품 목록 상태 정의 (초기값: initialProductList)
  const [products, setProducts] = useState(initialProductList);
  
  // useCartActions 커스텀 훅 사용: 장바구니 관련 기능 제공
  const { 
    cartItems, 
    lastPickProduct, 
    addToCart, 
    updateCartQuantity, 
  } = useCartActions(products, setProducts);

  // useCalculations 커스텀 훅 사용: 가격, 포인트 및 할인 상태 계산
  const { totalAmount, bonusPoints, discountStatus } = useCalculations(cartItems, products);

  // 이벤트 세일 훅 (상품 가격에 대한 동적 변화)
  useEventSale(products, setProducts);
  // 상품 추천 훅 (특정 조건에서 추천 상품 제시)
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