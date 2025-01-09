import React from "react";
import Cart from "./features/cart";
import { CartProvider } from "./contexts/CartContext";
import { ProductProvider } from "./contexts/ProductContext";
import { usePromotion } from "./hooks/usePromotion";

// 프로모션 로직을 위한 별도 컴포넌트
const PromotionManager = () => {
  usePromotion();
  return null;
};

const App = () => {
  return (
    <ProductProvider>
      <PromotionManager />
      <CartProvider>
        <div>
          <Cart />
        </div>
      </CartProvider>
    </ProductProvider>
  );
};

export default App;
