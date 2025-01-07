import React, { useMemo } from 'react';
import {
  CURRENCY,
  DISC_DAY_OF_THE_WEEK,
  DISC_RATES,
  ID_BY_COMPONENT,
  ITEM_DISC_MIN_QTY,
} from '../const';
import { Product } from '../type';

interface SumProps {
  productList: Product[];
  cartItemList: Product[];
}

const Sum: React.FC<SumProps> = ({ productList, cartItemList }) => {
  const { priceWithDisc, discRate } = useMemo(() => {
    let totalPrice = 0;
    let priceWithDisc = 0;
    let itemCnt = 0;

    for (let i = 0; i < cartItemList.length; i++) {
      const curItem = cartItemList[i];
      const qty = curItem.qty;
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

    console.log(priceWithDisc);
    console.log(discRate);

    return { priceWithDisc, discRate };
  }, [productList, cartItemList]);

  return (
    priceWithDisc > 0 && (
      <div id={ID_BY_COMPONENT.SUM_ID} className="text-xl font-bold my-4">
        총액: {Math.round(priceWithDisc)}${CURRENCY}
        <span className="text-green-500 ml-2">
          (${(discRate * 100).toFixed(1)}% 할인 적용)
        </span>
        <span id={ID_BY_COMPONENT.PTS_TAG_ID} className="text-blue-500 ml-2">
          (포인트: ${Math.floor(priceWithDisc / 1000)})
        </span>
      </div>
    )
  );
};

export default React.memo(Sum);
