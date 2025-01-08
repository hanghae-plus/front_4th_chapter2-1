import { AddToCartButton, CartDisplay, CartTotal } from "@basic/features/cart";
import { ProductSelect, ProductStatus } from "@basic/entities/product";
import { Heading } from "@basic/shared/ui";

export function Cart() {
  return `
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      ${Heading({ label: "장바구니" })}
      ${CartDisplay()}
      ${CartTotal()}
      ${ProductSelect()}
      ${AddToCartButton()}
      ${ProductStatus()}
    </div>
  `;
}
