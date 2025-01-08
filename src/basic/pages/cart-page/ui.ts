import { Cart } from "@basic/widgets";
import { html } from "@basic/shared/lib";

export function CartPage() {
  return html`<div class="bg-gray-100 p-8">${Cart()}</div>`;
}
