export const createElement = (
  tagName: string,
  attributes?: Record<string, string | (() => void)>
) => {
  const element = document.createElement(tagName);

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value as string;
      } else if (key === 'textContent') {
        element.textContent = value as string;
      } else if (key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
      } else {
        element.setAttribute(key, value as string);
      }
    });
  }

  return element;
};
