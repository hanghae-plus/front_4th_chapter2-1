import { html } from '../libs/index.js';
import { Wrapper } from './index.js';

export function Container() {
  return html` <div class="bg-gray-100 p-8">${Wrapper()}</div> `;
}
