import { updateProductOptions } from '../utils/updateProductOptions.js';

export function ProductSelect() {
  const select = document.createElement('select');
  select.id = 'product-select';
  select.className = 'border rounded p-2 mr-2';

  updateProductOptions(select);
  return select;
}
