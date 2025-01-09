import { cartStore } from "../../store";

export const updateCartState = (productId) => {
  cartStore.set("cartState", {
    ...(cartStore.get("cartState") || {}),
    lastSelected: productId,
  });
};
