import { DISCOUNT_PROBABILITY, itemList } from "../constants/constants.js";
import ProductOptions from "../components/Product/ProductOptions.js";

function alertCover(timeout, interval, func) {
  setTimeout(function () {
    setInterval(func(), interval);
  }, timeout);
}

// 할인하는 제품 정보 return
function applyDiscountItem(item, discountRate) {
  return {
    ...item,
    price: Math.round(item.price * (1 - discountRate)),
  };
}

function handleSuggestion(lastSel) {
  if (lastSel) {
    var suggest = itemList.find(function (item) {
      return item.id !== lastSel && item.qty > 0;
    });
    if (suggest) {
      alert(suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!");
      suggest.price = Math.round(suggest.price * 0.95);
      ProductOptions();
    }
  }
}

function handleRandomDiscount() {
  if (Math.random() >= DISCOUNT_PROBABILITY) return;
  const luckyItem = itemList[Math.floor(Math.random() * itemList.length)];
  if (luckyItem.qty > 0) {
    const discountedItem = applyDiscountItem(luckyItem, DISCOUNT_RATE);
    alert(`번개세일! ${discountedItem.name}이(가) 20% 할인 중입니다!`);
    ProductOptions();
  }
}

export function suggestionAlert(timeout, interval, lastSel) {
  alertCover(timeout, interval, () => handleSuggestion(lastSel));
}

export function discountAlert(timeout, interval) {
  alertCover(timeout, interval, handleRandomDiscount);
}
