export function updateCartItemQuantity(element, product, quantity) {
  element.querySelector('span').textContent =
    `${product.name} - ${product.price}원 x ${quantity}`;
}
