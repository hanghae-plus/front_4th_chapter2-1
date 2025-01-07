import { ALERT_MESSAGES, DISCOUNT_RATES } from "advanced/constants";
import { productList } from "advanced/store/productList";

export const eventUtil = (
  callback: () => void,
  interval: number,
  delay: number
) => {
  setTimeout(() => {
    setInterval(callback, interval);
  }, Math.random() * delay);
};

const handleSurpriseSale = () => {
  const luckyItem = productList[Math.floor(Math.random() * productList.length)];

  if (Math.random() < DISCOUNT_RATES.SURPRISE_SALE && luckyItem.remaining > 0) {
    luckyItem.price = Math.round(
      luckyItem.price * DISCOUNT_RATES.SURPRISE_SALE
    );

    alert(ALERT_MESSAGES.SURPRISE_SALE(luckyItem.name));

    // ProductOptions()
  }
};

let lastSelectedProductID = "p5"; // 임시. 전역관리 대상

const handleRecommendSale = () => {
  if (lastSelectedProductID) {
    const suggest = productList.find(
      (item) => item.id !== lastSelectedProductID && item.remaining > 0
    );

    if (suggest) {
      alert(ALERT_MESSAGES.RECOMMENDED_SALE(suggest.name));

      suggest.price = Math.round(
        suggest.price * DISCOUNT_RATES.RECOMMENDED_SALE
      );

      // ProductOptions();
    }
  }
};

export const setUpSaleEvents = () => {
  // 임의의 시간마다 깜짝세일 20%
  eventUtil(handleSurpriseSale, 30000, 10000);
  // 추천세일 5%
  eventUtil(handleRecommendSale, 60000, 20000);
};
