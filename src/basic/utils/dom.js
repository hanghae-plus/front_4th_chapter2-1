import { ELEMENT_IDS } from '../constants/element-id';

export const getStockStatusElement = () => document.getElementById(ELEMENT_IDS.STOCK_STATUS);
export const getAddCartButtonElement = () => document.getElementById(ELEMENT_IDS.ADD_TO_CART);
export const getProductSelectElement = () => document.getElementById(ELEMENT_IDS.PRODUCT_SELECT);
export const getCartTotalElement = () => document.getElementById(ELEMENT_IDS.CART_TOTAL);
export const getCartItemsElement = () => document.getElementById(ELEMENT_IDS.CART_ITEMS);
export const getProductItemElement = (id) => document.getElementById(id);

export const getDecreaseButtonElement = (id) =>
  document.querySelector(`button[data-product-id="${id}"][data-event-type="decrease"]`);
export const getIncreaseButtonElement = (id) =>
  document.querySelector(`button[data-product-id="${id}"][data-event-type="increase"]`);
export const getRemoveButtonElement = (id) =>
  document.querySelector(`button[data-product-id="${id}"][data-event-type="remove"]`);
