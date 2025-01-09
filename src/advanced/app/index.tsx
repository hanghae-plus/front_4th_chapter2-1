import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CartPage } from "@advanced/pages/cart";

if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line import/no-internal-modules
  const { worker } = await import("../../mocks/browser");
  await worker.start();
}

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <CartPage />
  </StrictMode>
);
