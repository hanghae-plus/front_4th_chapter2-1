import { useEffect } from "react";
import { CONSTANTS, Product } from "../config/constans";

const useRecommendations = (
  products: Product[], 
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
  lastPickProduct: string | null 
) => {
  useEffect(() => {
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

    return () => clearInterval(recommendTimer);
  }, [products, setProducts, lastPickProduct]);
};

export default useRecommendations;