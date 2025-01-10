import ReactDOM from "react-dom/client";
import Main from "./Main";
import { CartProvider } from "./contexts/CartProvider";

const rootElement = document.getElementById("app");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <CartProvider>
      <Main />
    </CartProvider>
  );
}
