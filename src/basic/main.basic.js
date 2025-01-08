import { Cart } from "./pages/Cart";

// clean code
const initializeApp = () => {
  const $rootElement = document.getElementById("app");
  const $cartComponent = Cart();
  $rootElement.appendChild($cartComponent);
};

initializeApp();
