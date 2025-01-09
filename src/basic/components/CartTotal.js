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

  return {
    element,
    handleChangeTextContent,
    appendChild,
  };
};
