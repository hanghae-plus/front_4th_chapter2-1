export function ItemOption(item) {
  return `<option value="${item.id}" ${item.quantity === 0 ? "disabled" : ""}>${
    item.name
  } - ${item.price}원</option>`;
}
