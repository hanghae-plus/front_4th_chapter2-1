export const DISC_DAY_OF_THE_WEEK = 2;
export const ITEM_DISC_MIN_QTY = 10;

const DISC_RATES_PER_ITEM = Object.freeze({
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
});

export const DISC_RATES = Object.freeze({
  LUCKY_DISC: 0.2,
  ADDITIONAL_DISC: 0.05,
  BULK_DISC: 0.25,
  DAY_OF_THE_WEEK_DISC: 0.1,
  ITEM_DISC: DISC_RATES_PER_ITEM,
});

export const DISC_PROB = Object.freeze({
  LUCKY_DISC: 0.3,
  ADDITIONAL_DISC: 1,
});

export const DISC_INITIAL_BUFFERS = Object.freeze({
  LUCKY_DISC: 10000,
  ADDITIONAL_DISC: 20000,
});

export const DISC_INTERVALS = Object.freeze({
  LUCKY_DISC: 30000,
  ADDITIONAL_DISC: 60000,
});

export const DISC_MSG = Object.freeze({
  LUCKY_DISC: (item, rate) => `번개세일! ${item}이(가) ${rate}% 할인 중입니다!`,
  ADDITIONAL_DISC: (item, rate) =>
    `${item}은(는) 어떠세요? 지금 구매하시면 ${rate}% 추가 할인!`,
});

export const discountAlertProcessor = (item, type) => {
  if (type !== "LUCKY_DISC" && type !== "ADDITIONAL_DISC") {
    throw Error(`${type} is not a supported discount type to alert.`);
  }

  if (Math.random() >= DISC_PROB[type] || item.qty <= 0) return;

  item.val = Math.round(item.val * (1 - DISC_RATES[type]));
  alert(DISC_MSG[type](item.name, DISC_RATES[type] * 100));
  updateSelOpts();
};
