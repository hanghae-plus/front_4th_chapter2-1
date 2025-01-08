export const createCartItemNameValueQuantityTemplate = (name: string, value: string | number, quantity = 1) => {
  return `<span>${name} - ${value + ''}원 x ${quantity}</span>`;
};
