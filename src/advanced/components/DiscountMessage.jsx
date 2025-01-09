import React from "react";

/**
 * DiscountMessgae
 * - discountStatus: 할인 상태를 담고있는 객체. totalOriginalAmount, totalDiscountedAmount 속성 포함
 */
const DiscountMessage = ({ discountStatus }) => {
  // 할인상태 아니면 아무것도 렌더링하지 않음
  if (!discountStatus) return null;

  // 할인 상태에서 원래 금애과 할인된 금액 추출
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