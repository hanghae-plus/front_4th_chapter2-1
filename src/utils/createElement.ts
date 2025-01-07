interface ElementAttributes {
  id?: string;
  className?: string;
  textContent?: string;
  class?: string;
}

export const createElement = <K extends keyof HTMLElementTagNameMap>(
  elementName: K,
  attributes: ElementAttributes = {},
  children: (Node | string)[] | Node | string = []
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(elementName);

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
