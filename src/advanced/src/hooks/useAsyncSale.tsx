import { useEffect } from 'react';
import { useCartContext } from '../context/CartContext';
import { applyDiscount } from '../utils/applyDiscount';

export const useSpecialSale = () => {
  const { productList, cartList, updateProductList, updateCartList } = useCartContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * productList.length);
        const luckyItem = productList[randomIndex];

        if (Math.random() < 0.3 && luckyItem.volume > 0) {
          const updatedproductList = productList.map((item) => (item.id === luckyItem.id ? applyDiscount(item, 0.2) : item));
          const updatedCartList = cartList.map((item) => (item.id === luckyItem.id ? applyDiscount(item, 0.2) : item));

          updateProductList(updatedproductList);
          updateCartList(updatedCartList);

          alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        }
      }, 30000);

      return () => clearInterval(interval);
    }, Math.random() * 10000);

    return () => clearTimeout(timeout);
  }, [productList, updateProductList]);
};

export const useAdditionSale = () => {
  const { productList, cartList, updateProductList, updateCartList, currentSelect } = useCartContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentSelect) {
          const suggestedItem = productList.find((item) => item.id !== currentSelect && item.volume > 0);

          if (suggestedItem) {
            const updatedproductList = productList.map((item) => (item.id === suggestedItem.id ? applyDiscount(item, 0.05) : item));
            const updatedCartList = cartList.map((item) => (item.id === suggestedItem.id ? applyDiscount(item, 0.05) : item));

            updateProductList(updatedproductList);
            updateCartList(updatedCartList);

            alert(`${suggestedItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          }
        }
      }, 60000);

      return () => clearInterval(interval);
    }, Math.random() * 20000);

    return () => clearTimeout(timeout);
  }, [productList, currentSelect, updateProductList]);
};
