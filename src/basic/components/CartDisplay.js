import { html } from '../libs/index.js';

export function CartDisplay({ onClick } = {}) {
  return html` <div id="cart-items" onClick=${onClick}></div> `;
}
