import { productList } from '../data/productList.js';

export function updateProductOptions(select) {
  select.innerHTML = '';
  productList.forEach((product) => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = `${product.name} - ${product.price}원 (재고: ${product.quantity})`;
    if (product.quantity === 0) {
      option.disabled = true;
    }
    select.appendChild(option);
  });
}
