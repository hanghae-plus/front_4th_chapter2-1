import { ItemOption } from "../components";
import { productsStore } from "../store/productsStore";
import { renderToElement } from "./commonUtils";

const products = productsStore.getInstance().getProducts();

export const updateSelectOptions = () => {
  renderToElement("#product-select", products.map(ItemOption).join(""));
};

export const splitItemPriceQuantity = (itemElement) => itemElement.querySelector("span").textContent.split("x ");

export const getProdData = (productId) => {
  const prod = products.find((p) => p.id === productId);
  const itemElem = document.getElementById(productId);
  const [_, curQuantity] = splitItemPriceQuantity(itemElem);
  return { prod, itemElem, curQuantity: Number(curQuantity) };
};
