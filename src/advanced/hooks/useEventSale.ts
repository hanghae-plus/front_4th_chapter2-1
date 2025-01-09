import { useEffect } from "react";
import { CONSTANTS, Product } from "../config/constans";

const useEventSale = (
  products: Product[], 
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
) => {
  useEffect(() => {
    const eventSaleTimer = setInterval(() => {
      setProducts(prev => {
        const luckyItemIndex = Math.floor(Math.random() * prev.length);
        if (Math.random() < CONSTANTS.SALE_CHANCE && prev[luckyItemIndex].quantity > 0) {
          const newProducts = [...prev];
          const luckyItem = newProducts[luckyItemIndex];
          luckyItem.price = Math.round(luckyItem.price * (1 - CONSTANTS.SALE_DISCOUNT));
          alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
          return newProducts;
        }
        return prev;
      });
    }, 30000);

    return () => clearInterval(eventSaleTimer);
  }, [setProducts]);

};

export default useEventSale;