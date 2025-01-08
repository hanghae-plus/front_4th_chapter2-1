const ShoppingCartTotalPrice = () => {
  return (
    <div className="text-xl font-bold mb-4">
      총액: 20,000원
      <span className="text-sm text-green-500 ml-2">(10% 할인 적용)</span>
      <span className="text-sm text-blue-500 ml-2">(포인트: 20)</span>
    </div>
  );
};

export default ShoppingCartTotalPrice;
