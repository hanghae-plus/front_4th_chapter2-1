const pipe =
  (...functions) =>
  (input) =>
    functions.reduce((acc, fn) => fn(acc), input);

const querySelector = (selector) => {
  return document.querySelector(selector);
};

const renderContent = (content) => (element) => {
  element.innerHTML = content;
  return element;
};

const appendContent = (content) => (element) => {
  element.innerHTML += content;
  return element;
};

const delay = (ms) => (callback) => setTimeout(callback, ms);

const repeat = (ms) => (callback) => () => setInterval(callback, ms);

export const renderToElement = (selector, content) =>
  pipe(querySelector, renderContent(content))(selector);

export const appendToElement = (selector, content) =>
  pipe(querySelector, appendContent(content))(selector);

export const scheduleInterval = (callback, intervalMs, delayMs) =>
  pipe(repeat(intervalMs), delay(delayMs))(callback);
