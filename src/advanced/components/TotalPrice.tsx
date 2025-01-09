interface TotalPriceProps {
  price: number;
  discountRate: number;
}

const TotalPrice = ({discountRate, price}:TotalPriceProps) => {
  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      총액: {price.toLocaleString()}원
      {discountRate > 0 && (
        <span
          className="text-green-500 ml-2">({(discountRate * 100).toFixed(1)}% 할인 적용)</span>
      )}
      <span id="loyalty-points" className="text-blue-500 ml-2">
            (포인트: {price / 1000})
          </span>
    </div>
  );
};

export default TotalPrice;
