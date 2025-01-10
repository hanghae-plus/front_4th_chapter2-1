export const CartItems = () => {
  const element = document.createElement("div");
  element.id = "cart-items";

  const children = [];

  const appendChild = (child) => {
    element.appendChild(child.element);
    children.push(child);
  };

  const findChildById = (id) => {
    return children.find((c) => c.id === id);
  };

  const onClick = (handler) => {
    const reference = (event) => handler(event);

    element.addEventListener("click", reference);

    return reference;
  };

  return {
    element,
    appendChild,
    findChildById,
    onClick,
  };
};
