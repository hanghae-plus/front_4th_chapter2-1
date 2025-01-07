export const createElement = <T extends HTMLElement>(
  tagName: string,
  attributes?: Record<string, string | (() => void)>
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
        default:
          element.setAttribute(key, value as string);
      }
    });
  }

  return element;
};
