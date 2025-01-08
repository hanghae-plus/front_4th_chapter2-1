export function applyPromotions(prodList, productSelect) {
  prodList.forEach((product) => {
    if (Math.random() < 0.3 && product.q > 0) {
      product.val = Math.round(product.val * 0.8);
      alert(`${product.name} - 번개 세일! 20% 할인 중!`);
    }
  });

  // Update the product select options
  const updateProductOptions = (selectElement) => {
    selectElement.innerHTML = '';
    prodList.forEach((product) => {
      const option = document.createElement('option');
      option.value = product.id;
      option.textContent = `${product.name} - ${product.val} 원`;
      if (product.q === 0) option.disabled = true;
      selectElement.appendChild(option);
    });
  };
  updateProductOptions(productSelect);
}
