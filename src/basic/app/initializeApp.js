import { createStore } from "../store/store.js";
import { renderProductOptions } from "../components/ProductSelect.js";
import { renderTotal } from "../components/TotalDisplay.js";
import { renderStockInfo } from "../components/StockInfo.js";
import { createCartItem } from "../components/CartItem.js";
import { calculateCart } from "../utils/calculateCart.js";

export function initializeApp(products) {
  const store = createStore({ products, lastSelected: null });

  const root = document.getElementById("app");
}
