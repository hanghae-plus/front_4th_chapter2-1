export const ProductSelect = ({ productList }) => {
  // onChange 이벤트 핸들러 props로 받기

  return `
  <select id="product-select" class="border rounded p-2 mr-2">
  ${productList
    .map((product) => {
      return `<option value="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>${product.name} - ${product.price}원</option>`;
    })
    .join('')}
    </select>
  `;
};

export const renderProductSelectOptionElement = ({ productList }) => {
  const $productSelect = document.getElementById('product-select');
  $productSelect.innerHTML = ProductSelect({ productList });
};
