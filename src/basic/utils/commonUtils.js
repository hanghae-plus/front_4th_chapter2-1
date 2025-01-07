const pipe =
  (...functions) =>
  (input) =>
    functions.reduce((acc, fn) => fn(acc), input);

const querySelector = (selector) => {
  return document.querySelector(selector);
};

const renderContent = (element, content) => {
  element.innerHTML = content;
  return element;
};

const appendContent = (element, content) => {
  element.innerHTML += content;
  return element;
};

export const renderToElement = (selector, content) =>
  pipe(querySelector, (element) => renderContent(element, content))(selector);
export const appendToElement = (selector, content) =>
  pipe(querySelector, (element) => appendContent(element, content))(selector);
