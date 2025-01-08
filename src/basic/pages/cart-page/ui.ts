import { Cart } from "@basic/widgets";

export function CartPage() {
  return `
    <div class="bg-gray-100 p-8">
      ${Cart()}
    </div>
  `;
}
