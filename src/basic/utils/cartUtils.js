import { appendToElement, renderToElement } from "./commonUtils";
import { CartTotalPrice, DiscountRate, Points } from "../components";
import { productsStore } from "../store/productsStore";
import { getProdData } from "./productUtils";

let cartTotalPrice = 0;
const products = productsStore.getInstance().getProducts();

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
