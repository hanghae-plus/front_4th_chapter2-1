import { Product } from '../../shared/entity/model/Product';

const getStockInfo = (productList: Product[]) => {
  let message = '';
  productList.forEach(function (item) {
    if (item.quantity < 5) {
      message +=
        item.name +
        ': ' +
        (item.quantity > 0
          ? '재고 부족 (' + item.quantity + '개 남음)'
          : '품절') +
        '\n';
    }
  });
  return message;
};

export { getStockInfo };
