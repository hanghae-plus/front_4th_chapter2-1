import { createElement as h } from '../utils/createElement';

export const ProductSelect = () => {
  return h<HTMLSelectElement>('select', {
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });
};
