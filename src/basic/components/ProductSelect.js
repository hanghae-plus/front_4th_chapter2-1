import { ELEMENT_IDS } from '../constants/element-id';
import { products } from '../data/products';
import { getProductSelectElement } from '../utils/dom';

const ProductSelect = ({ products }) => {
  return `
    <select id="${ELEMENT_IDS.PRODUCT_SELECT}" class="border rounded p-2 mr-2">${products
      .map(
        ({ id, name, price, quantity }) =>
          `<option value="${id}" ${quantity === 0 ? 'disabled' : null}>${name} - ${price}원</option>`,
      )
      .join('')}</select>
  `;
};

export default ProductSelect;

export const updateProductSelect = () => {
  const selectElement = getProductSelectElement();
  selectElement.innerHTML = ProductSelect({ products });
};
