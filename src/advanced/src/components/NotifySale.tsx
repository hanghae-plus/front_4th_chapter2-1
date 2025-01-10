import { useProductsStateContext } from '../contexts/ProductsProvider';
import { useEffectOnce } from '../hooks/useEffectOnce';

export const NotifySale = () => {
  const { products } = useProductsStateContext('NotifySale');

  useEffectOnce(() => {
    setTimeout(() => {
      setInterval(() => {
        const luckyProduct = products[Math.floor(Math.random() * products.length)];
        const soldOut = luckyProduct.stock === 0;

        const chance = 0.3;
        const discountRatio = 0.2;

        if (Math.random() < chance && !soldOut) {
          luckyProduct.price = Math.round(luckyProduct.price * (1 - discountRatio));
          alert(`번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
        }
      }, 30000);
    }, Math.random() * 10000);
  });

  return <div />;
};
