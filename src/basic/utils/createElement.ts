export const createElement = <T extends HTMLElement>(
  tagName: string,
  attributes?: Record<string, string | (() => void)>
): T => {
  const element = document.createElement(tagName) as T;

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value as string;
      } else if (key === 'textContent') {
        element.textContent = value as string;
      } else {
        element.setAttribute(key, value as string);
      }
    });
  }

  return element;
};
