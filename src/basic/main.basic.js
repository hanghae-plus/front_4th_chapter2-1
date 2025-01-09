import { container } from "./components/container";
import { useCalcCart, useUpdateSelOpts } from "./hooks";
import { setupIntervals } from "./common/timers";

function main() {
  const root = document.getElementById("app");
  const containerElement = container();
  root.appendChild(containerElement);

  useUpdateSelOpts();
  useCalcCart();
  setupIntervals();
}

main();
