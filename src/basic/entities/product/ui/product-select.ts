import { html } from "@basic/shared/lib/render";
import { productStore } from "../model";

export function ProductSelect() {
  const { products } = productStore.getState();

  return html`
    <select id="product-select" class="border rounded p-2 mr-2">
      ${products
        .map(
          (product) => `
            <option 
              value="${product.id}"
              ${product.q === 0 ? "disabled" : ""} 
            >${product.name} - ${product.val}원</option>`
        )
        .join("")}
    </select>
  `;
}
