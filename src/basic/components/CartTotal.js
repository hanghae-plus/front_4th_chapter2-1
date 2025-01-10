export const CartTotal = () => {
  const element = document.createElement("div");
  element.id = "cart-total";
  element.className = "text-xl font-bold my-4";

  const handleChangeTextContent = (textContent) => {
    element.textContent = textContent;
  };

  const appendChild = (child) => {
    element.appendChild(child.element);
  };

  const handleUpdateCartSummary = ({
    totalAmount,
    discountRate,
    bonusPoints,
    DiscountRateComponent,
    BonusPointsComponent,
  }) => {
    handleChangeTextContent("총액: " + Math.round(totalAmount) + "원");
    if (discountRate > 0) {
      appendChild(DiscountRateComponent(discountRate));
    }
    appendChild(BonusPointsComponent(bonusPoints));
  };

  return {
    element,
    handleChangeTextContent,
    handleUpdateCartSummary,
    appendChild,
  };
};
