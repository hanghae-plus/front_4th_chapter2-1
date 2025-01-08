import { productStore } from "@basic/entities/product";
import { addEvent, html } from "@basic/shared/lib";
import { cartStore } from "../model";

export function AddToCartButton() {
  const { products } = productStore.getState();
  const { addToCart } = cartStore.getState();

  addEvent("add-to-cart", "click", () => {
    const $productSelect = document.getElementById(
      "product-select"
    ) as HTMLSelectElement;

    const productId = $productSelect.value;
    const selectedProduct = products.find(
      (product) => product.id === productId
    );

    if (!selectedProduct) return;

    addToCart(selectedProduct);
  });

  return html`
    <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">
      추가
    </button>
  `;
}
