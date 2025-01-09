import { useProducts } from '../hooks/useProduct.js';

function ProductStatus() {
  const element = document.createElement('div');
  element.id = 'stock-status';
  element.className = 'text-sm text-gray-500 mt-2';

  const render = () => {
    const { getProducts } = useProducts();
    const products = getProducts();

    element.innerHTML = products
      .filter((product) => product.quantity === 0)
      .map((product) => `<span>${product.name}: 품절</span>`)
      .join('');
  };

  return {
    getElement: () => element,
    render,
  };
}

export default ProductStatus;
