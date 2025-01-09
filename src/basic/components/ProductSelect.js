export const ProductSelect = () => {
  const element = document.createElement("select");
  element.id = "product-select";
  element.className = "border rounded p-2 mr-2";

  const appendChild = (child) => {
    element.appendChild(child.element);
  };

  const reset = () => {
    element.innerHTML = "";
  };

  const getValue = () => {
    return element.value;
  };

  const handleUpdateProductOption = (items, Component) => {
    reset();
    items.forEach((item) => {
      const option = Component({ item });
      appendChild(option);
    });
  };

  return {
    element,
    appendChild,
    getValue,
    reset,
    handleUpdateProductOption,
  };
};
