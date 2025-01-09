import { changeQuantity, removeProduct } from "../../../../utils";

export const CartItem = () => {
  let $cartItem = document.createElement("div");
  const cartItemId = "cart-items";

  $cartItem.id = cartItemId;

  $cartItem.addEventListener("click", (event) => {
    const $target = event.target;
    if (!$target.matches("button")) return;

    const productId = $target.dataset.productId;

    if ($target.classList.contains("quantity-change")) {
      const change = parseInt($target.dataset.change);
      changeQuantity(productId, change);
    } else if ($target.classList.contains("remove-item")) {
      removeProduct(productId);
    }
  });

  return $cartItem;
};
