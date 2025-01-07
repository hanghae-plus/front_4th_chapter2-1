import ReactDOM from "react-dom/client";
import MainAdvanced from "./MainAdvanced";

const rootElement = document.getElementById("app");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<MainAdvanced />);
}
