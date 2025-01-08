import { html } from "@basic/shared/lib";
import { productStore } from "../model";

export function ProductStatus() {
  const { products } = productStore.getState();

  return html`
    <div id="stock-status" class="text-sm text-gray-500 mt-2">
      ${products
        .filter((product) => product.q < 5)
        .map(
          (product) =>
            `${product.name}: ${product.q > 0 ? "재고 부족 (" + product.q + "개 남음)" : "품절"}`
        )
        .join("\n")}
    </div>
  `;
}
