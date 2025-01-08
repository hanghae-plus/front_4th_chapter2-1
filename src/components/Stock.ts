import { cartStore } from '@/stores/cartStore';

const Stock = (stockStatus: HTMLElement) => {
  let info = '';
  const productList = cartStore.get('productList');

  productList.forEach((product) => {
    if (product.stock < 5) {
      info +=
        product.name +
        ': ' +
        (product.stock > 0 ? '재고 부족 (' + product.stock + '개 남음)' : '품절') +
        '\n';
    }
  });
  stockStatus.textContent = info;
};

export default Stock;
