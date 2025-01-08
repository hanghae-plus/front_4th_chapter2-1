export function calculateCart(cartItems, products) {
  const result = {
    total: 0,
    count: 0,
    items: new Map(),
    discountRate: 0,
  };

  cartItems.forEach((item) => {
    const productId = item.id;
    const quantity = parseInt(
      item.querySelector("span").textContent.split("x ")[1],
    );
    const product = products.find((p) => p.id === productId);

    result.count += quantity;
    const itemTotal = product.val * quantity;
    result.total += itemTotal;
    result.items.set(productId, { quantity, product });
  });

  if (result.count >= 10 || new Date().getDay() === 2) {
    result.discountRate = 0.1;
    result.total *= 0.9;
  }

  return result;
}
