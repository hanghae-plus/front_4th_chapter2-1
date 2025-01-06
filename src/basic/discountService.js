import {
  DISC_INITIAL_BUFFERS,
  DISC_INTERVALS,
  DISC_DAY_OF_THE_WEEK,
  DISC_RATES,
  ITEM_DISC_MIN_QTY,
  DISC_PROB,
} from './const';

const DISC_MSG = Object.freeze({
  LUCKY_DISC: (item, rate) => `번개세일! ${item}이(가) ${rate}% 할인 중입니다!`,
  ADDITIONAL_DISC: (item, rate) =>
    `${item}은(는) 어떠세요? 지금 구매하시면 ${rate}% 추가 할인!`,
});

const discountAlertProcessor = (item, type, updater) => {
  if (type !== 'LUCKY_DISC' && type !== 'ADDITIONAL_DISC') {
    throw Error(`${type} is not a supported discount type to alert.`);
  }

  if (Math.random() >= DISC_PROB[type] || item.qty <= 0) return;

  item.val = Math.round(item.val * (1 - DISC_RATES[type]));
  alert(DISC_MSG[type](item.name, DISC_RATES[type] * 100));
  updater();
};

export const setLuckyDiscAlert = (productList, updater) => {
  setTimeout(() => {
    setInterval(() => {
      const luckyItem =
        productList[Math.floor(Math.random() * productList.length)];
      discountAlertProcessor(luckyItem, 'LUCKY_DISC', () =>
        updater(productList),
      );
    }, DISC_INTERVALS.LUCKY_DISC);
  }, Math.random() * DISC_INITIAL_BUFFERS.LUCKY_DISC);
};

export const setAdditionalDiscAlert = (productList, lastSel, updater) => {
  setTimeout(() => {
    setInterval(() => {
      if (!lastSel) return;
      const suggestedItem = productList.find((item) => item.id !== lastSel);
      discountAlertProcessor(suggestedItem, 'ADDITIONAL_DISC', () =>
        updater(productList),
      );
    }, DISC_INTERVALS.ADDITIONAL_DISC);
  }, Math.random() * DISC_INITIAL_BUFFERS.ADDITIONAL_DISC);
};

export const getDiscPriceAndRate = (cart, productList) => {
  const cartItems = cart.children;
  let totalPrice = 0;
  let priceWithDisc = 0;
  let itemCnt = 0;

  for (let i = 0; i < cartItems.length; i++) {
    const curItem = productList.find(
      (product) => product.id === cartItems[i].id,
    );
    const qty = parseInt(
      cartItems[i].querySelector('span').textContent.split('x ')[1],
    );
    const itemTotalPrice = curItem.val * qty;
    itemCnt += qty;
    totalPrice += itemTotalPrice;

    const disc =
      qty >= ITEM_DISC_MIN_QTY ? DISC_RATES.ITEM_DISC[curItem.id] : 0;

    priceWithDisc += itemTotalPrice * (1 - disc);
  }

  let discRate = 0;

  if (itemCnt >= 30) {
    const bulkDisc = totalPrice * DISC_RATES.BULK_DISC;
    const itemDisc = totalPrice - priceWithDisc;
    if (bulkDisc > itemDisc) {
      priceWithDisc = totalPrice * (1 - DISC_RATES.BULK_DISC);
    }
  }
  discRate = (totalPrice - priceWithDisc) / totalPrice;

  if (new Date().getDay() === DISC_DAY_OF_THE_WEEK) {
    priceWithDisc *= 1 - DISC_RATES.DAY_OF_THE_WEEK_DISC;
    discRate = Math.max(discRate, DISC_RATES.DAY_OF_THE_WEEK_DISC);
  }

  return { priceWithDisc, discRate };
};
