import React from "react";

const DiscountMessage = ({ discountStatus }) => {
  if (!discountStatus) return null;

  const { totalOriginalAmount, totalDiscountedAmount } = discountStatus;

  // 전체 할인율 계산 (0으로 나누기 방지)
  const effectiveDiscountRate = totalOriginalAmount > 0
    ? ((totalOriginalAmount - totalDiscountedAmount) / totalOriginalAmount) * 100
    : 0;

  return (
    <div className="text-sm text-green-500 mt-1">
      <span className="font-bold">
        ({effectiveDiscountRate.toFixed(1)}% 할인 적용)
      </span>
    </div>
  );
};

export default DiscountMessage;