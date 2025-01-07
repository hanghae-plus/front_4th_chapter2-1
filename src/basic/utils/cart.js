export const getItemQuantity = ($target) => {
  return parseInt($target.querySelector('span').textContent.split('x ')[1]);
};
