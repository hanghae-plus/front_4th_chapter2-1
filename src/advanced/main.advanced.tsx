import ReactDOM from "react-dom/client";
import App from "./App.jsx";

const rootElement = document.getElementById("app");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
