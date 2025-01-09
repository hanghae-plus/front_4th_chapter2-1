import { useProducts } from '../hooks/useProduct.js';

export function ProductSelect() {
  const element = document.createElement('select');
  element.id = 'product-select';
  element.className = 'border rounded p-2 mr-2';

  element.addEventListener('change', (e) => {
    const { selectProduct } = useProducts();
    selectProduct(e.target.value);
  });

  const render = () => {
    const { getProducts } = useProducts();
    const products = getProducts();

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
