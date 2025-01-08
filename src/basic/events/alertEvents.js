import { productsStore } from "../store/productsStore";
import { updateSelectOptions } from "../utils";

const products = productsStore.getInstance().getProducts();

export const alertSaleEvent = (lastSel) => {
  const luckyItem = products[Math.floor(Math.random() * products.length)];
  if (Math.random() < 0.3 && luckyItem.quantity > 0) {
    luckyItem.price = Math.round(luckyItem.price * 0.8);
    alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
    updateSelectOptions();
  }
};

export const alertLastSelEvent = (lastSel) => {
  if (lastSel) {
    const suggest = products.find((item) => item.id !== lastSel && item.quantity > 0);
    if (suggest) {
      alert(suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!");
      suggest.price = Math.round(suggest.price * 0.95);
      updateSelectOptions();
    }
  }
};
