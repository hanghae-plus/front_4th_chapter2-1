import { PRODUCT_LIST } from '../datas/productList.js';
import { updateProductOptions } from './updateProductOptions.js';
import { getLastSelectedItem } from '../main.basic.js';

export function startPromotions() {
  setTimeout(function () {
    setInterval(function () {
      if (getLastSelectedItem) {
        const suggest = PRODUCT_LIST.find(function (item) {
          return item.id !== getLastSelectedItem && item.quantity > 0;
        });
        if (suggest) {
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
          );
          suggest.price = Math.round(suggest.price * 0.95);
          updateProductOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}
