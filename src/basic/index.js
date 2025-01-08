import { initializeApp } from "./app/initializeApp.js";
import { PRODUCTS } from "./constants/products.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeApp(PRODUCTS);
});
