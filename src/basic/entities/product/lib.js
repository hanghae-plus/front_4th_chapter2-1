export const formatProductOption = (product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  textContent: `${product.name} - ${product.price}원`,
});
