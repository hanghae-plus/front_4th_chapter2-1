import { useEffect } from "react";
import { CONSTANTS, Product } from "../config/constans";

const useEventSale = (
  products: Product[], 
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
  lastPickProduct: string | null 
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

    const recommendTimer = setInterval(() => {
      if (lastPickProduct) {
        setProducts(prev => {
          const recommendedItem = prev.find(
            item => item.id !== lastPickProduct && item.quantity > 0
          );
          if (recommendedItem) {
            const newProducts = [...prev];
            const itemIndex = newProducts.findIndex((item) => item.id === recommendedItem.id);
            newProducts[itemIndex].price = Math.floor(
              newProducts[itemIndex].price * (1 - CONSTANTS.SUGGEST_DISCOUNT)
            );
            alert(`${recommendedItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
            return newProducts;
          }
          return prev;
        });
      }
    }, 60000);

    return () => {
      clearInterval(eventSaleTimer);
      clearInterval(recommendTimer);
    }
  }, [setProducts, lastPickProduct]);

};

export default useEventSale;