import { Discount } from '../Discount';

export const renderDiscount = ($cartTotal: HTMLElement, discountRate: number) => {
  if (discountRate > 0) {
    $cartTotal.appendChild(Discount(discountRate));
  }
};
