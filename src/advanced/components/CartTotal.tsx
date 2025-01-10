const CartTotal = () => {
  const totalAmount = 0;
  const discountRate = 0;
  const totalPoint = 0;
  //const totalAmount = cartStore.get('totalAmount');
  //const discountRate = cartStore.get('discountRate') || 0;
  //const totalPoint = Math.floor(totalAmount / 1000);

  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      총액: {Math.round(totalAmount)}원
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">({(discountRate * 100).toFixed(1)}% 할인 적용)</span>
      )}
      <span id="loyalty-points" className="text-blue-500 ml-2">
        (포인트: {totalPoint})
      </span>
    </div>
  );
};

export default CartTotal;
