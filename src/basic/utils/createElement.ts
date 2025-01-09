export const createElement = <T extends HTMLElement>(
  tagName: string,
  attributes?: Record<string, string | (() => void)>,
  children?: (HTMLElement | string)[]
): T => {
  const element = document.createElement(tagName) as T;

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      switch (key) {
        case 'className':
          element.className = value as string;
          break;
        case 'textContent':
          element.textContent = value as string;
          break;
        case 'innerHTML':
          element.innerHTML = value as string;
          break;
        case 'id':
          element.id = value as string;
          break;
        default:
          element.setAttribute(key, value as string);
      }
    });
  }

  if (children) {
    children.forEach((child) => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
  }

  return element;
};
