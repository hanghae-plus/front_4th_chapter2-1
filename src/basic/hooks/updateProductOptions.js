import { selectedProduct } from '../main.basic.js';
import { productList } from '../data/productList.js';

export function updateProductOptions() {
  selectedProduct.innerHTML = '';
  productList.forEach(function (item) {
    const optionElement = document.createElement('option');
    optionElement.value = item.id;
    optionElement.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) optionElement.disabled = true;
    selectedProduct.appendChild(optionElement);
  });
}
