import { useEffect } from 'react';

import type { Product } from '../../../types/product';

export const useFlashSale = (
  productList: Product[],
  setProductList: React.Dispatch<React.SetStateAction<Product[]>>,
) => {
  const notifyFlashSale = (item: Product) => {
    alert(`번개세일! ${item.name}이(가) 20% 할인 중입니다!`);
  };

  const applyFlashSale = (item: Product) => {
    const discountedAmout = Math.round(item.amount * 0.8);
    const newProductList = productList.map((product) =>
      product.id === item.id ? { ...product, amount: discountedAmout } : product,
    );

    setProductList(newProductList);
  };

  const getRandomProduct = () => {
    return productList[Math.floor(Math.random() * productList.length)];
  };

  const triggerFlashSale = () => {
    const luckyItem = getRandomProduct();

    const shouldApplyFlashSale = Math.random() < 0.3 && luckyItem.quantity > 0;

    if (shouldApplyFlashSale) {
      applyFlashSale(luckyItem);
      notifyFlashSale(luckyItem);
    }
  };

  useEffect(() => {
    const initialDelay = Math.random() * 10000;

    const flashSaleInterval = 30000;

    const saleTimeout = setTimeout(() => {
      const saleInterval = setInterval(triggerFlashSale, flashSaleInterval);
      return () => clearInterval(saleInterval);
    }, initialDelay);

    return () => clearTimeout(saleTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
