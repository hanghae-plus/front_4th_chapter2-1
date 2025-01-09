import { html } from '../libs/index.js';

export function SelectedProd() {
  return html` <select
    id="product-select"
    class="border rounded p-2 mr-2"
  ></select>`;
}
