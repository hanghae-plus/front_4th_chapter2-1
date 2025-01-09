function ProductStatus({ products }) {
  const element = document.createElement('div');
  element.className = 'text-sm text-gray-500 mt-2';

  const render = () => {
    element.innerHTML = products
      .filter((product) => product.quantity === 0)
      .map((product) => `<span>${product.id}: 품절</span>`)
      .join('');
  };

  return {
    getElement: () => element,
    render,
  };
}

export default ProductStatus;
