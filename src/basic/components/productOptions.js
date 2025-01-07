import { PRODUCT_LIST } from '../data/productData';

export const insertProductOptions = () => {
  const $productSelect = document.getElementById('product-select');
  $productSelect.innerHTML = '';
  PRODUCT_LIST.forEach(function (item) {
    var opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = item.name + ' - ' + item.price + '원';
    if (item.q === 0) opt.disabled = true;
    $productSelect.appendChild(opt);
  });
};
