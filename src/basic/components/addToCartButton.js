import { prodList, setLastSel } from "../common/state";
import { useCalcCart } from "../hooks/useCalcCart";
import { newItem } from "./newItem";

export const AddToCartButton = () => {
  const button = document.createElement("button");
  button.id = "add-to-cart";
  button.className = "bg-blue-500 text-white px-4 py-2 rounded";
  button.textContent = "추가";

  button.addEventListener("click", () => {
    const selItem = document.getElementById("product-select").value;
    const itemToAdd = prodList.find((p) => p.id === selItem);

    if (itemToAdd && itemToAdd.q > 0) {
      const item = document.getElementById(itemToAdd.id);
      if (item) {
        const newQty =
          parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;
        if (newQty <= itemToAdd.q) {
          item.querySelector("span").textContent =
            `${itemToAdd.name} - ${itemToAdd.val}원 x ${newQty}`;
          itemToAdd.q--;
        } else {
          alert("재고가 부족합니다.");
        }
      } else {
        const newItemComponent = newItem(itemToAdd);
        const cartDisplayElement = document.getElementById("cart-display");
        if (!cartDisplayElement) {
          console.error("cart-display 요소를 찾을 수 없습니다.");
          return;
        }
        cartDisplayElement.appendChild(newItemComponent);
        itemToAdd.q--;
      }
      useCalcCart();
      setLastSel(selItem);
    }
  });

  return button;
};
