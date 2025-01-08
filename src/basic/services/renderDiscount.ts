import { Discount } from '../components/Discount';

export const renderDiscount = ($cartTotal: HTMLElement, discountRate: number) => {
  if (discountRate > 0) {
    $cartTotal.appendChild(Discount(discountRate));
  }
};
