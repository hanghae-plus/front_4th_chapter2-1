export const appendDiscountedRateTag = ($sum: HTMLElement, discountedRate: number) => {
  const span = document.createElement('span');
  span.className = 'text-green-500 ml-2';
  span.textContent = '(' + (discountedRate * 100).toFixed(1) + '% 할인 적용)';
  $sum.appendChild(span);
};
