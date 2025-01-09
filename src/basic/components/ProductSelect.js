export const ProductSelect = ({ productList }) => {
  return `
    <select id="product-select" class="border rounded p-2 mr-2">
      ${productList
        .map(
          (prod) => `
          <option value="${prod.id}" ${prod.q === 0 ? 'disabled' : ''}>
            ${prod.name} - ${prod.val} 원
          </option>
        `
        )
        .join('')}
    </select>
  `;
};
