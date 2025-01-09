export const createElement = (
  tag,
  className = "",
  textContent = "",
  id = ""
) => {
  const elem = document.createElement(tag);
  if (className) elem.className = className;
  if (textContent) elem.textContent = textContent;
  if (id) elem.id = id;
  return elem;
};

export const appendChildren = (parent, children) => {
  children.forEach((child) => parent.appendChild(child));
};
