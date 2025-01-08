export function calculateCart(prodList, cartDisplay, cartTotal) {
  let total = 0;
  let itemCount = 0;

  const cartItems = cartDisplay.children;

  for (const item of cartItems) {
    const productId = item.id;
    const product = prodList.find((item) => item.id === productId);

    if (product) {
      const quantity = parseInt(
        item.querySelector('.item-quantity').textContent,
        10,
      );
      total += product.val * quantity;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      itemCount += quantity;
    }
  }

  cartTotal.textContent = `총액: ${total} 원`;
}
