import { prodList, lastSel } from "./state";
import { useUpdateSelOpts } from "../hooks/useUpdateSelOpts";

const LIGHTNING_SALE_INTERVAL = 30000;
const SUGGESTION_INTERVAL = 60000;
const LIGHTNING_SALE_PROBABILITY = 0.3;
const LIGHTNING_SALE_DISCOUNT = 0.8;
const SUGGESTION_DISCOUNT = 0.95;

const handleLightningSale = () => {
  const luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
  if (Math.random() < LIGHTNING_SALE_PROBABILITY && luckyItem.q > 0) {
    luckyItem.val = Math.round(luckyItem.val * LIGHTNING_SALE_DISCOUNT);
    alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
    useUpdateSelOpts();
  }
};

const handleProductSuggestion = () => {
  if (lastSel) {
    const suggest = prodList.find((item) => item.id !== lastSel && item.q > 0);
    if (suggest) {
      alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
      suggest.val = Math.round(suggest.val * SUGGESTION_DISCOUNT);
      useUpdateSelOpts();
    }
  }
};

export const setupIntervals = () => {
  setTimeout(() => {
    setInterval(handleLightningSale, LIGHTNING_SALE_INTERVAL);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(handleProductSuggestion, SUGGESTION_INTERVAL);
  }, Math.random() * 20000);
};
