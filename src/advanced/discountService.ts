import {
  DISC_INITIAL_BUFFERS,
  DISC_INTERVALS,
  DISC_RATES,
  DISC_PROB,
} from './const';

const DISC_MSG = Object.freeze({
  LUCKY_DISC: (item, rate) => `번개세일! ${item}이(가) ${rate}% 할인 중입니다!`,
  ADDITIONAL_DISC: (item, rate) =>
    `${item}은(는) 어떠세요? 지금 구매하시면 ${rate}% 추가 할인!`,
});

const discountAlertProcessor = (item, type) => {
  if (type !== 'LUCKY_DISC' && type !== 'ADDITIONAL_DISC') {
    throw Error(`${type} is not a supported discount type to alert.`);
  }

  if (Math.random() >= DISC_PROB[type] || item.qty <= 0) return;

  item.val = Math.round(item.val * (1 - DISC_RATES[type]));
  alert(DISC_MSG[type](item.name, DISC_RATES[type] * 100));
};

export const setLuckyDiscAlert = (productList) => {
  setTimeout(() => {
    setInterval(() => {
      const luckyItem =
        productList[Math.floor(Math.random() * productList.length)];
      discountAlertProcessor(luckyItem, 'LUCKY_DISC');
    }, DISC_INTERVALS.LUCKY_DISC);
  }, Math.random() * DISC_INITIAL_BUFFERS.LUCKY_DISC);
};

export const setAdditionalDiscAlert = (productList, lastSel) => {
  setTimeout(() => {
    setInterval(() => {
      if (!lastSel) return;
      const suggestedItem = productList.find((item) => item.id !== lastSel);
      discountAlertProcessor(suggestedItem, 'ADDITIONAL_DISC');
    }, DISC_INTERVALS.ADDITIONAL_DISC);
  }, Math.random() * DISC_INITIAL_BUFFERS.ADDITIONAL_DISC);
};
