import { PRODUCT_LIST } from '../const/constance.js';
import { getSelectedProduct } from '../main.basic.js';

export function updateProductOptions() {
  getSelectedProduct.innerHTML = '';
  PRODUCT_LIST.forEach(function (item) {
    const optionElement = document.createElement('option');
    optionElement.value = item.id;
    optionElement.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) optionElement.disabled = true;
    getSelectedProduct.appendChild(optionElement);
  });
}
