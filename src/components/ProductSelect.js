export function ProductSelect({ products, onSelect }) {
  const element = document.createElement('select');
  element.className = 'border rounded p-2 mr-2';

  const render = () => {
    element.innerHTML = products
      .map(
        (product) => `
      <option value="${product.id}" ${product.quality === 0 ? 'disabled' : ''}>${product.name} - ${product.price}원</option>
    `,
      )
      .join('');
  };

  element.addEventListener('change', (e) => onSelect(e.target.value));

  return {
    getElement: () => element,
    render,
  };
}
