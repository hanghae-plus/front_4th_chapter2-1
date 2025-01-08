import { productStore } from "@basic/entities/product";
import { addEvent } from "@basic/shared/lib/event";
import { html } from "@basic/shared/lib/render";
import { cartStore } from "../model";

export function CartDisplay() {
  const { products } = productStore.getState();
  const { cart, addToCart, removeToCart, deleteToCart } = cartStore.getState();

  addEvent("quantity-minus", "click", (event: Event) => {
    const target = event.target as HTMLButtonElement;

    const productId = target.dataset.productId;

    if (!productId) return;
    removeToCart(productId);
  });

  addEvent("quantity-plus", "click", (event: Event) => {
    const target = event.target as HTMLButtonElement;

    const productId = target.dataset.productId;
    const targetProduct = products.find((product) => product.id === productId);
    if (!targetProduct) return;

    addToCart(targetProduct);
  });

  addEvent("remove-item", "click", (event: Event) => {
    const target = event.target as HTMLButtonElement;

    const productId = target.dataset.productId;

    if (!productId) return;
    deleteToCart(productId);
  });

  return html`
    <div id="cart-items">
      ${cart
        .map(
          (cartItem) => html`
            <div
              id="${cartItem.id}"
              class="flex justify-between items-center mb-2"
            >
              <span>${cartItem.name} - ${cartItem.val}원 x ${cartItem.q}</span>
              <div>
                <button
                  id="quantity-minus"
                  class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  data-product-id="${cartItem.id}"
                  data-change="-1"
                >
                  -
                </button>
                <button
                  id="quantity-plus"
                  class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  data-product-id="${cartItem.id}"
                  data-change="1"
                >
                  +
                </button>
                <button
                  id="remove-item"
                  class="remove-item bg-red-500 text-white px-2 py-1 rounded"
                  data-product-id="${cartItem.id}"
                >
                  삭제
                </button>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}
