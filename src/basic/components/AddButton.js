import { html } from '../libs/index.js';

export function AddButton() {
  return html`
    <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">
      추가
    </button>
  `;
}
