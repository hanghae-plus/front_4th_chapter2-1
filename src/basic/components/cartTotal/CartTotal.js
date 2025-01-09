/**
 * 장바구니 총 금액을 표시하는 컴포넌트
 * @returns {HTMLDivElement} 총 금액을 표시하는 div 요소
 */
export default function CartTotal() {
  const totalDisplay = document.createElement('div');
  totalDisplay.id = 'cart-total';
  totalDisplay.className = 'text-xl font-bold my-4';

  return totalDisplay;
}
