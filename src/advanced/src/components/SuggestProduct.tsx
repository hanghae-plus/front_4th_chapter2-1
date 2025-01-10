import { useEffect } from 'react';
import { useOrderStateContext } from '../contexts/OrderProvider';
import { useProductsActionsContext } from '../contexts/ProductsProvider';

export const SuggestProduct = () => {
  const { getProduct, updateProduct } = useProductsActionsContext('SuggestProduct');
  const { recentOrder } = useOrderStateContext('SuggestProduct');

  useEffect(() => {
    let timer: number;
    let interval: number;

    timer = setTimeout(() => {
      interval = setInterval(() => {
        const suggest = getProduct(recentOrder);

        if (!suggest) return;

        const discountRatio = 0.5;

        updateProduct({ ...suggest, price: Math.round(suggest.price * (1 - discountRatio)) });
        alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
      }, 60000);
    }, Math.random() * 20000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [recentOrder]);

  return <div />;
};
