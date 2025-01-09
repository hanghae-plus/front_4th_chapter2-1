import { wrapper } from "./";

const wrapperElement = wrapper();

export const container = () => {
  const containerDiv = document.createElement("div");
  containerDiv.className = "bg-gray-100 p-8";

  containerDiv.appendChild(wrapperElement);

  return containerDiv;
};
