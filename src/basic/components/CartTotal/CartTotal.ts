import { createElement } from '../../utils/createElement';

export const renderCartTotal = ($cartTotal: HTMLElement, totalAmount: number) => {
  $cartTotal.textContent = `총액: ${totalAmount}원`;
};

export const renderDiscount = ($cartTotal: HTMLElement, discountRate: number) => {
  if (discountRate > 0) {
    const span = createElement('span', {
      className: 'text-green-500 ml-2',
      textContent: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`,
    });

    $cartTotal.appendChild(span);
  }
};
