export const opt = (item) => {
  const option = document.createElement("option");
  option.value = item.id;
  option.disabled = item.q === 0;
  option.textContent = `${item.name} - ${item.val}원`;
  return option;
};
