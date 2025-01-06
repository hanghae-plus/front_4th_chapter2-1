export const createElement = (tag, attributes = {}, children = []) => {
  const element = document.createElement(tag);

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  if (!Array.isArray(children)) {
    children = [children];
  }

  children.forEach((child) =>
    typeof child === 'string'
      ? element.appendChild(document.createTextNode(child))
      : element.appendChild(child)
  );

  return element;
};
