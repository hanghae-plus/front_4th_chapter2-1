import { prepareProductOptions } from './lib.js';

const createOptionElement = (options) => {
  const optionElement = document.createElement('option');
  optionElement.value = options.id;
  optionElement.textContent = options.textContent;
  optionElement.disabled = options.disabled;
  return optionElement;
};

export const updateSelectedOptions = (parentElement, products) => {
  parentElement.innerHTML = '';
  const options = prepareProductOptions(products);
  options.forEach((option) => {
    parentElement.appendChild(createOptionElement(option));
  });
};
