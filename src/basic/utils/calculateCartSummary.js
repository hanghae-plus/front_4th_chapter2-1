export function calculateCartSummary() {
  const cartDisplay = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  if (!cartDisplay || !cartTotal) return;

  let totalAmount = 0;
  let itemCount = 0;

  // 장바구니에 있는 모든 항목 계산
  Array.from(cartDisplay.children).forEach((itemElement) => {
    const itemText = itemElement.querySelector('span').textContent;
    const price = parseInt(itemText.match(/- (\d+)원/)[1], 10); // 가격 추출
    const quantity = parseInt(itemText.match(/x (\d+)$/)[1], 10); // 수량 추출

    totalAmount += price * quantity;
    itemCount += quantity;
  });

  // 결과를 DOM에 업데이트
  cartTotal.textContent = `총 ${itemCount}개 | 총합: ${totalAmount.toLocaleString()}원`;
}
