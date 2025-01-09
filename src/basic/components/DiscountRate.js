export const DiscountRate = (discountRate) => {
  const element = document.createElement("element");
  element.className = "text-green-500 ml-2";
  element.textContent = "(" + (discountRate * 100).toFixed(1) + "% 할인 적용)";

  return {
    element,
  };
};
