const DiscountMessage = ({ discountStatus }) => (
  <div className="text-sm text-green-500 mt-1">
    {discountStatus.dayDiscountApplied && (
      <span className="mr-2">(화요일 10.0% 할인 적용)</span>
    )}
    {discountStatus.bulkDiscountApplied && (
      <span className="mr-2">(25.0% 대량구매 할인 적용)</span>
    )}
    {discountStatus.quantityDiscount && (
      <span>(개별상품 할인 적용)</span>
    )}
  </div>
);

export default DiscountMessage;