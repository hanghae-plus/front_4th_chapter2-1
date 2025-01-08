import { renderProductOptionsView } from '../components/ProductOptionsView';
import { Product } from '../../../shared/entity/model/Product';

const luckyEvent = (SelectView: HTMLSelectElement, productList: Product[]) => {
  const luckyItem = productList[Math.floor(Math.random() * productList.length)];
  if (Math.random() < 0.3 && luckyItem.quantity > 0) {
    luckyItem.price = Math.round(luckyItem.price * 0.8);
    alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
    renderProductOptionsView(SelectView, productList);
  }
};

export { luckyEvent };
