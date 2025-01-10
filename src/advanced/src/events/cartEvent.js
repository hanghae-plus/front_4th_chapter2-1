import { PRODUCT_LIST } from "../data/prodList";
export const handleAddToCart = (target) => {
  const productId = target.dataset.productId;
  const product = PRODUCT_LIST.find((item) => item.id === productId);
  console.log(target);
  var itemElem = document.getElementById(productId);

  if (target.classList.contains("quantity-change")) {
    var quantityChange = parseInt(target.dataset.change);
    var newQuantity =
      parseInt(itemElem.querySelector("span").textContent.split("x ")[1]) +
      quantityChange;

    if (
      newQuantity > 0 &&
      newQuantity <=
        product.stock +
          parseInt(itemElem.querySelector("span").textContent.split("x ")[1])
    ) {
      itemElem.querySelector("span").textContent =
        itemElem.querySelector("span").textContent.split("x ")[0] +
        "x " +
        newQuantity;
      product.stock -= quantityChange;
    } else if (newQuantity <= 0) {
      itemElem.remove();
      product.stock -= quantityChange;
    } else {
      alert("재고가 부족합니다.");
    }
  }
};

export const handleDeleteToCart = (target) => {
  var prodId = target.dataset.productId;
  var itemElem = document.getElementById(prodId);
  var product = PRODUCT_LIST.find((product) => {
    return product.id === prodId;
  });
  if (target.classList.contains("quantity-change")) {
    var stockChange = parseInt(target.dataset.change);
    var newStock =
      parseInt(itemElem.querySelector("span").textContent.split("x ")[1]) +
      stockChange;
    if (
      newStock > 0 &&
      newStock <=
        product.stock +
          parseInt(itemElem.querySelector("span").textContent.split("x ")[1])
    ) {
      itemElem.querySelector("span").textContent =
        itemElem.querySelector("span").textContent.split("x ")[0] +
        "x " +
        newStock;
      product.stock -= stockChange;
    } else if (newStock <= 0) {
      itemElem.remove();
      product.stock -= stockChange;
    } else {
      alert("재고가 부족합니다.");
    }
  } else if (target.classList.contains("remove-item")) {
    var remQty = parseInt(
      itemElem.querySelector("span").textContent.split("x ")[1]
    );
    product.stock += remQty;
    itemElem.remove();
  }
};

export const updateCartList = (itemToAdd) => {
  if (itemToAdd && itemToAdd.stock > 0) {
    var item = document.getElementById(itemToAdd.id);
    if (item) {
      var newQty =
        parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;
      if (newQty <= itemToAdd.stock) {
        item.querySelector("span").textContent =
          itemToAdd.name + " - " + itemToAdd.cost + "원 x " + newQty;
        itemToAdd.stock--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      return setNewItemUI(itemToAdd);
    }
  }
};
const setNewItemUI = (itemToAdd) => {
  let newItem = document.createElement("div");
  newItem.id = itemToAdd.id;
  newItem.className = "flex justify-between items-center mb-2";
  newItem.innerHTML = Item(itemToAdd).trim();
  itemToAdd.stock--;
  return newItem;
};

export const Item = (itemToAdd) => {
  return `
  <span>${itemToAdd.name} - ${itemToAdd.cost}원 x 1</span>
  <div>
    <button
      class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
      data-product-id="${itemToAdd.id}"
      data-change="-1"
    >
      -
    </button>
    <button
      class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
      data-product-id="${itemToAdd.id}"
      data-change="1"
    >
      +
    </button>
    <button
      class="remove-item bg-red-500 text-white px-2 py-1 rounded"
      data-product-id="${itemToAdd.id}"
    >
      삭제
    </button>
  </div>`;
};
