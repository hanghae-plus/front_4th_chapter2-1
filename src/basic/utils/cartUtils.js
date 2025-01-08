import { appendToElement, renderToElement, replaceToElement } from "./commonUtils";
import { CartItem, CartItemInfo, CartTotalPrice, DiscountRate, Points } from "../components";
import { productsStore } from "../store/productsStore";

let cartTotalPrice = 0;
const products = productsStore.getInstance().getProducts();

const splitItemPriceQuantity = (itemElement) => itemElement.querySelector("span").textContent.split("x ");

const getProdData = (productId) => {
  const prod = products.find((p) => p.id === productId);
  const itemElem = document.getElementById(productId);
  const [_, curQuantity] = splitItemPriceQuantity(itemElem);
  return { prod, itemElem, curQuantity: Number(curQuantity) };
};

const calcTotalPrice = () => {
  cartTotalPrice = 0;
  [...document.querySelector("#cart-items").children].forEach((item) => {
    const { prod, curQuantity } = getProdData(item.id);
    let discount = 1;
    if (curQuantity >= 10) {
      discount = 1 - prod.discount;
    }
    cartTotalPrice += prod.price * curQuantity * discount;
  });
  return cartTotalPrice;
};

const calcItemCnt = () => {
  let itemCnt = 0;
  [...document.querySelector("#cart-items").children].forEach((item) => {
    const { curQuantity } = getProdData(item.id);
    itemCnt += curQuantity;
  });
  return itemCnt;
};

const calcOriginTotalPrice = () => {
  let originTotalPrice = 0;
  [...document.querySelector("#cart-items").children].forEach((item) => {
    const { prod, curQuantity } = getProdData(item.id);
    originTotalPrice += prod.price * curQuantity;
  });
  return originTotalPrice;
};

const calcDiscountRate = (itemCnt, originTotalPrice) => {
  const bulkDiscPrice = originTotalPrice * 0.25;
  const normalDiscPrice = originTotalPrice - cartTotalPrice;
  const originDiscountRate = (originTotalPrice - cartTotalPrice) / originTotalPrice;

  return itemCnt >= 30 && bulkDiscPrice > normalDiscPrice ? 0.25 : originDiscountRate;
};

export const calcCart = () => {
  cartTotalPrice = calcTotalPrice();
  let itemCnt = calcItemCnt();
  let originTotalPrice = calcOriginTotalPrice();
  let discountRate = calcDiscountRate(itemCnt, originTotalPrice);

  if (new Date().getDay() === 2) {
    cartTotalPrice *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  renderToElement("#cart-total", CartTotalPrice(cartTotalPrice));

  if (discountRate > 0) {
    appendToElement("#cart-total", DiscountRate(discountRate));
  }

  updateStockStatus();
  renderPoints();
};

const updateStockStatus = () => {
  renderToElement("#stock-status", products.filter(isLowStock).map(makeLowStockMessage).join(""));
};

const isLowStock = (product) => product.quantity < 5;

const makeLowStockMessage = (product) => {
  return `${product.name}: ${product.quantity > 0 ? "재고 부족 (" + product.quantity + "개 남음)" : "품절"}\n`;
};

const renderPoints = () => {
  const bonusPts = Math.floor(cartTotalPrice / 1000);
  appendToElement("#cart-total", Points(bonusPts));
};

export const addToCartClickHandler = () => {
  const selItem = document.querySelector("#product-select").value;
  const itemToAdd = products.find((p) => p.id === selItem);

  if (!(itemToAdd && itemToAdd.quantity > 0)) return;

  const itemElem = document.getElementById(itemToAdd.id);
  if (itemElem) {
    const [_, curQuantity] = splitItemPriceQuantity(itemElem);
    const newQty = Number(curQuantity) + 1;
    if (newQty <= itemToAdd.quantity) {
      replaceToElement(`#${itemToAdd.id} > span`, CartItemInfo({ ...itemToAdd, quantity: newQty }));
      itemToAdd.quantity--;
    } else {
      alert("재고가 부족합니다.");
    }
  } else {
    appendToElement("#cart-items", CartItem(itemToAdd));
    itemToAdd.quantity--;
  }
  calcCart();
  return selItem;
};

export const cartItemsClickHandler = (event) => {
  const { classList, dataset } = event.target;

  if (classList.contains("quantity-change")) {
    quantityChange(dataset);
  }

  if (classList.contains("remove-item")) {
    removeItem(dataset);
  }

  calcCart();
};

const quantityChange = ({ productId, change }) => {
  const qtyChange = Number(change);
  const { prod, itemElem, curQuantity } = getProdData(productId);
  const newQty = curQuantity + qtyChange;
  const totalQty = prod.quantity + curQuantity;

  if (newQty > 0 && newQty <= totalQty) {
    replaceToElement(`#${itemElem.id} > span`, CartItemInfo({ ...prod, quantity: newQty }));
    prod.quantity -= qtyChange;
    return;
  }

  if (newQty <= 0) {
    itemElem.remove();
    prod.quantity -= qtyChange;
    return;
  }

  alert("재고가 부족합니다.");
};

const removeItem = ({ productId }) => {
  const { prod, itemElem, curQuantity } = getProdData(productId);

  prod.quantity += curQuantity;
  itemElem.remove();
};
