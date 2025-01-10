import { html } from "@basic/shared/lib";
import { productStore } from "../model";

export function ProductSelect() {
  const { products } = productStore.getState();

  return html`
    <select id="product-select" class="border rounded p-2 mr-2">
      ${products
        .map(
          (product) => ` <option
              value="${product.id}"
              ${product.quantity === 0 ? "disabled" : ""}
            >
              ${product.name} - ${product.cost}원
            </option>`
        )
        .join("")}
    </select>
  `;
}
