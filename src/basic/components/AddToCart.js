export const AddToCart = () => {
  const element = document.createElement("button");
  element.id = "add-to-cart";
  element.className = "bg-blue-500 text-white px-4 py-2 rounded";
  element.textContent = "추가";

  return element;
};
