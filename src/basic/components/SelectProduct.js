import { createUIElement } from "../utils/createUIElement.js";

export function renderProductOptions(select, products) {
  select.innerHTML = "";
  products.forEach((item) => {
    const option = createUIElement("option");
    option.value = item.id;
    option.textContent = `${item.name} - ${item.val}원`;
    option.disabled = item.q === 0;
    select.appendChild(option);
  });
}
