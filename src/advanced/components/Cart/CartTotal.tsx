interface CartTotalProps {
  total: number;
  discountRate: number;
}

export function CartTotal({ total, discountRate }: CartTotalProps) {
  return (
    <div className="text-xl font-bold my-4">
      총액: {Math.round(total)}원
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">
          ({(discountRate * 100).toFixed(1)}% 할인 적용)
        </span>
      )}
      <span className="text-blue-500 ml-2">
        (포인트: {Math.floor(total / 1000)})
      </span>
    </div>
  );
}
