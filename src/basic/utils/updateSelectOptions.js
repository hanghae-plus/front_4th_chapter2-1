import { html } from '../libs/index.js';

export const updateSelectOptions = ({ component, items }) => {
  component.update({ children: [''] });
  items.forEach(item => {
    const opt = html`<option value=${item.id} disabled=${item.qty === 0}>
      ${item.name} - ${item.val}원
    </option>`;
    component.update({ children: [...component.children, opt] });
  });
};
