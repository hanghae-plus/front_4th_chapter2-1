const CartTotal = ({ amount, discountRate, point }) => {
  return /* html */ `<div class="text-xl font-bold my-4">총액: ${Math.round(amount)}원${
    discountRate > 0 ? `<span class="text-green-500 ml-2">(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>` : ''
  }(포인트: ${point})</div>`;
};

export default CartTotal;
