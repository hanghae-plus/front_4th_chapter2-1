type TotalPriceProps = {
  totalAmount: number;
  discountRate: number;
};

export const TotalPrice = ({ totalAmount, discountRate }: TotalPriceProps) => {
  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      총액: {totalAmount}원
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>
      )}
    </div>
  );
};
