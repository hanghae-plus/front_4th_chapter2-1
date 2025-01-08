export const updateCartTotalText = ($cartTotal: HTMLElement, totalAmount: number) => {
  $cartTotal.textContent = `총액: ${totalAmount}원`;
};
