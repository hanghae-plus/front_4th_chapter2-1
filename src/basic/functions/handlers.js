import { itemList } from "../constants/constants.js";

export function handleAddItem(productOptions, lastSelectedItem, shoppingCart) {
  let selItem = productOptions.value;
  let itemToAdd = itemList.find(function (p) {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.qty > 0) {
    let item = document.getElementById(itemToAdd.id);
    if (item) {
      let newQty =
        parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;
      if (newQty <= itemToAdd.qty) {
        item.querySelector("span").textContent =
          itemToAdd.name + " - " + itemToAdd.price + "원 x " + newQty;
        itemToAdd.qty--;
      } else {
        console.log("재고", newQty, itemToAdd);
        alert("재고가 부족합니다.");
      }
    } else {
      const newItem = document.createElement("div");
      newItem.id = itemToAdd.id;
      newItem.className = "flex justify-between items-center mb-2";
      newItem.innerHTML =
        "<span>" +
        itemToAdd.name +
        " - " +
        itemToAdd.price +
        "원 x 1</span><div>" +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>';
      shoppingCart.appendChild(newItem);
      itemToAdd.qty--;
    }
    lastSelectedItem = selItem;
  }
}

export function handleCartEvent(event) {
  let target = event.target;
  if (
    target.classList.contains("quantity-change") ||
    target.classList.contains("remove-item")
  ) {
    const prodId = target.dataset.productId;
    const itemElem = document.getElementById(prodId);
    const prod = itemList.find(function (p) {
      return p.id === prodId;
    });
    if (target.classList.contains("quantity-change")) {
      let qtyChange = parseInt(target.dataset.change);
      let newQty =
        parseInt(itemElem.querySelector("span").textContent.split("x ")[1]) +
        qtyChange;
      if (
        newQty > 0 &&
        newQty <=
          prod.qty +
            parseInt(itemElem.querySelector("span").textContent.split("x ")[1])
      ) {
        itemElem.querySelector("span").textContent =
          itemElem.querySelector("span").textContent.split("x ")[0] +
          "x " +
          newQty;
        prod.qty -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.qty -= qtyChange;
      } else {
        console.log("prod", newQty);
        alert("재고가 부족합니다.");
      }
    } else if (target.classList.contains("remove-item")) {
      let remQty = parseInt(
        itemElem.querySelector("span").textContent.split("x ")[1],
      );
      prod.qty += remQty;
      itemElem.remove();
    }
  }
}
