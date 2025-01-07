import { createElement } from '../core/createElement.js';

export const ProductSelector = () => {
  const select = createElement('select', {
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });

  // updateSelectedOptions(); // 기존 함수 재사용
  return select;
};

export const AddToCartButton = () => {
  return createElement('button', {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
  });
};

export const StockStatus = () => {
  return createElement('div', {
    id: 'stock-status',
    className: 'text-sm text-gray-500 mt-2',
  });
};
