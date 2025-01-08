import { productStore } from "../model";

export function ProductSelect() {
  const products = productStore.getState().products;

  return `
    <select id="product-select" class="border rounded p-2 mr-2">
      ${products
        .map(
          (product) =>
            `<option value="${product.id}" ${product.q === 0 ? "disabled" : ""}>${product.name} - ${product.val}원</option>`
        )
        .join("")}
    </select>
  `;
}
