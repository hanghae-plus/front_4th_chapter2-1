import { CartTemplate } from '../components/cart/CartTemplate.js';

export const render = () => {
  const $root = document.getElementById('app');

  $root.innerHTML = CartTemplate();
};
