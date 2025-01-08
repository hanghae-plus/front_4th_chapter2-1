export const createElement = (tagName, attributes = {}) => {
  const element = document.createElement(tagName);

  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key.startsWith('data-')) {
      element.setAttribute(key, value);
    } else if (key === 'textContent') {
      element.textContent = value;
    } else if (key === 'onclick') {
      element.onclick = value;
    } else {
      element.setAttribute(key, value);
    }
  });

  return element;
};
