export const AddToCart = () => {
  const element = document.createElement("button");
  element.id = "add-to-cart";
  element.className = "bg-blue-500 text-white px-4 py-2 rounded";
  element.textContent = "추가";

  const onClick = (handler) => {
    const reference = (event) => handler(event);

    element.addEventListener("click", reference);

    return reference;
  };

  return {
    element,
    onClick,
  };
};
