export function ProductSelect({ products }) {
  const element = document.createElement('select');
  element.className = 'border rounded p-2 mr-2';

  const render = () => {
    element.innerHTML = products
      .map(
        (product) => `
      <option value="${product.id}" ${product.quantity === 0 ? 'disabled' : ''}>${product.name} - ${product.price}원</option>
    `,
      )
      .join('');
  };

  return {
    getElement: () => element,
    render,
  };
}
