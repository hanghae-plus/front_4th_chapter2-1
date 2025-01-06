function Total(finalTotal, discountRate) {
  const cartTotal = document.getElementById('cart-total');
  cartTotal.textContent = `총액: ${Math.round(finalTotal)}원`;

  if (discountRate > 0) {
    const discountTag = document.createElement('span');
    discountTag.className = 'text-green-500 ml-2';
    discountTag.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
    cartTotal.appendChild(discountTag);
  }
}

export default Total;
