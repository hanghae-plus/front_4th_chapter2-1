import { state } from '../store/globalStore';

const BULK_AMOUNT = 30;
const BULK_DISCOUNT_RATE = 0.25;
const SPECIAL_DAY = 2;
const SPECIAL_DAY_DISCOUNT_RATE = 0.1;

function calcCart() {
  let totalAmt = 0;
  let itemCnt = 0;

  const cartList = state.get('cartList');

  let totalAmtBeforeDisc = 0;
  let discRate = 0;

  cartList.forEach((cartItem) => {
    const currentItem = findProductById(cartItem.id);
    if (!currentItem) return;

    const quantity = cartItem.volume;

    const itemTotal = currentItem.price * quantity;
    const discountRate = getDiscountRate(currentItem.id, quantity);

    totalAmt += itemTotal * (1 - discountRate);
    itemCnt += quantity;
    totalAmtBeforeDisc += itemTotal;
  });

  ({ totalAmt, discRate } = applyBulkDiscount(
    totalAmt,
    itemCnt,
    totalAmtBeforeDisc,
    discRate
  ));
  ({ totalAmt, discRate } = applySpecialdayDiscount(totalAmt, discRate));

  state.set('totalAmt', totalAmt);
  state.set('itemCnt', itemCnt);
  state.set('discountRate', discRate);
}

const findProductById = (productId) => {
  const prodList = state.get('prodList');
  return prodList.find((product) => product.id === productId);
};

const getDiscountRate = (productId, quantity) => {
  const DISCOUNT_RATES = {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25
  };

  if (quantity >= 10 && DISCOUNT_RATES[productId]) {
    return DISCOUNT_RATES[productId];
  }
  return 0;
};

const applyBulkDiscount = (totalAmt, itemCnt, totalAmtBeforeDisc, discRate) => {
  if (totalAmtBeforeDisc === 0) return { totalAmt, discRate };

  const calDefaultDiscRate = () =>
    (totalAmtBeforeDisc - totalAmt) / totalAmtBeforeDisc;

  if (itemCnt >= BULK_AMOUNT) {
    const bulkDiscountAmount = totalAmtBeforeDisc * BULK_DISCOUNT_RATE;
    const currentDiscountAmount = totalAmtBeforeDisc - totalAmt;

    if (bulkDiscountAmount > currentDiscountAmount) {
      totalAmt = totalAmtBeforeDisc * (1 - BULK_DISCOUNT_RATE);
      discRate = BULK_DISCOUNT_RATE;
    } else {
      discRate = calDefaultDiscRate();
    }
  } else {
    discRate = calDefaultDiscRate();
  }

  return { totalAmt, discRate };
};

const applySpecialdayDiscount = (totalAmt, discRate) => {
  const today = new Date().getDay();

  if (today === SPECIAL_DAY) {
    totalAmt *= 1 - SPECIAL_DAY_DISCOUNT_RATE;
    discRate = Math.max(discRate, SPECIAL_DAY_DISCOUNT_RATE);
  }

  return { totalAmt, discRate };
};

export default calcCart;
