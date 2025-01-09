export const Heading = () => {
  const element = document.createElement("h1");
  element.className = "text-2xl font-bold mb-4";
  element.textContent = "장바구니";

  return {
    element,
  };
};
