export const Content = () => {
  const element = document.createElement("div");
  element.className = "bg-gray-100 p-8";

  const appendChild = (child) => {
    element.appendChild(child.element);
  };

  return {
    element,
    appendChild,
  };
};
