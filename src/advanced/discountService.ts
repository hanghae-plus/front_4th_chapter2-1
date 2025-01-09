import {
  DISC_INITIAL_BUFFERS,
  DISC_INTERVALS,
  DISC_RATES,
  DISC_PROB,
} from './const';
import { Discount, Product } from './type';

const DISC_MSG = Object.freeze({
  LUCKY_DISC: (itemName: string, rate: number) =>
    `번개세일! ${itemName}이(가) ${rate}% 할인 중입니다!`,
  ADDITIONAL_DISC: (itemName: string, rate: number) =>
    `${itemName}은(는) 어떠세요? 지금 구매하시면 ${rate}% 추가 할인!`,
});

const discountAlertProcessor = (
  product: Product,
  type: Discount,
  setRandomDiscRateByProduct: (productId: string, rate: number) => void,
) => {
  if (type !== 'LUCKY_DISC' && type !== 'ADDITIONAL_DISC') {
    throw Error(`${type} is not a supported discount type to alert.`);
  }

  if (Math.random() >= DISC_PROB[type] || product.qty <= 0) return;

  setRandomDiscRateByProduct(product.id, DISC_RATES[type]);

  alert(DISC_MSG[type](product.name, DISC_RATES[type] * 100));
};

export const setLuckyDiscAlert = (
  productList: Product[],
  setRandomDiscRateByProduct: (productId: string, rate: number) => void,
) => {
  setTimeout(() => {
    setInterval(() => {
      const luckyItem =
        productList[Math.floor(Math.random() * productList.length)];

      discountAlertProcessor(
        luckyItem,
        'LUCKY_DISC',
        setRandomDiscRateByProduct,
      );
    }, DISC_INTERVALS.LUCKY_DISC);
  }, Math.random() * DISC_INITIAL_BUFFERS.LUCKY_DISC);
};

export const setAdditionalDiscAlert = (
  productList: Product[],
  lastSelId: string | null,
  setRandomDiscRateByProduct: (productId: string, rate: number) => void,
) => {
  setTimeout(() => {
    setInterval(() => {
      if (!lastSelId) return;

      const suggestedProduct = productList.find(
        (item) => item.id !== lastSelId,
      );

      if (!suggestedProduct) return;

      discountAlertProcessor(
        suggestedProduct,
        'ADDITIONAL_DISC',
        setRandomDiscRateByProduct,
      );
    }, DISC_INTERVALS.ADDITIONAL_DISC);
  }, Math.random() * DISC_INITIAL_BUFFERS.ADDITIONAL_DISC);
};
