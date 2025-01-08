import { createElement } from '../core/createElement.js';

export const ProductSelector = () => {
  const select = createElement('select', {
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });
  // updateSelectedOptions(select);
  return select;
};

export const StockStatus = () => {
  return createElement('div', {
    id: 'stock-status',
    className: 'text-sm text-gray-500 mt-2',
  });
};
