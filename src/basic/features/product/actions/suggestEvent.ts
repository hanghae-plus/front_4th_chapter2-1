import { renderProductOptionsView } from '../components/ProductOptionsView';
import { Product } from '../../../shared/entity/model/Product';

const suggestEvent = (
  selectedItemId: string | null = null,
  productList: Product[],
  SelectView: HTMLSelectElement,
) => {
  if (selectedItemId) {
    const suggest = productList.find(function (item) {
      return item.id !== selectedItemId && item.quantity > 0;
    });
    if (suggest) {
      alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
      suggest.price = Math.round(suggest.price * 0.95);
      renderProductOptionsView(SelectView, productList);
    }
  }
};

export { suggestEvent };
