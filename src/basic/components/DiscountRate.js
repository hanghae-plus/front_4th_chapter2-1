export function DiscountRate(discountRate) {
  return `<span class="text-green-500 ml-2">(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>`;
}
