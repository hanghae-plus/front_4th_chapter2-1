export const StockStatus = () => {
  const element = document.createElement("div");
  element.id = "stock-status";
  element.className = "text-sm text-gray-500 mt-2";

  const handleChangeTextContent = (textContent) => {
    element.textContent = textContent;
  };

  return {
    element,
    handleChangeTextContent,
  };
};
