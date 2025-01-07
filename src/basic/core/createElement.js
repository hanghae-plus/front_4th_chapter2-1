export const createElement = (type, props) => {
  const element = document.createElement(type);
  Object.entries(props).forEach(([key, value]) => {
    element[key] = value;
  });
  return element;
};
