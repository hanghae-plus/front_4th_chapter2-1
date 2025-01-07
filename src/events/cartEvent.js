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
        product.cost +
          parseInt(itemElem.querySelector("span").textContent.split("x ")[1])
    ) {
      itemElem.querySelector("span").textContent =
        itemElem.querySelector("span").textContent.split("x ")[0] +
        "x " +
        newQuantity;
      product.cost -= quantityChange;
    } else if (newQuantity <= 0) {
      itemElem.remove();
      product.cost -= quantityChange;
    } else {
      alert("재고가 부족합니다.");
    }
  }
};

export const handleDeleteToCart = (target) => {
  const productId = target.dataset.productId;
  const product = PRODUCT_LIST.find((item) => item.id === productId);
  var itemElem = document.getElementById(productId);

  var removeQuantity = parseInt(
    itemElem.querySelector("span").textContent.split("x ")[1]
  );
  product.cost += removeQuantity;
  itemElem.remove();
};
