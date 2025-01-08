// 상품 업데이트
export function updateSelectOptions() {
  select.innerHTML = "";
  productList.forEach(function (item) {
    let option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name + " - " + item.value + "원";

    if (item.quantity === 0) {
      option.disabled = true;
    }

    select.appendChild(option);
  });
}
