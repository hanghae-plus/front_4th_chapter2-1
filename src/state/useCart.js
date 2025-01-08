export function useCart() {
  let cart = new Map();

  return {
    cart: cart,
    setCart: (newCart) => {
      cart = new Map(newCart);
    },
  };
}
