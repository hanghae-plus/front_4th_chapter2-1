import { Container, createRoot } from "react-dom/client";
import { App } from "./App";

const domNode = document.querySelector("#app") as Container;
const root = createRoot(domNode);

root.render(<App />);
