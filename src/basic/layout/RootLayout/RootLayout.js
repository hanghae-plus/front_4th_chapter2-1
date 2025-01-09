import { createElements } from "../../utils/createElements.js";
import MainContents from "../MainContents/MainContents.js";

export default function PageLayout(
  shoppingCart,
  cartTotalCost,
  productOptions,
  addButton,
  stockStatus,
) {
  const Root = document.getElementById("app");
  const Layout = createElements({
    tag: "div",
    className: "bg-gray-100 p-8",
  });

  Layout.appendChild(
    MainContents(
      shoppingCart,
      cartTotalCost,
      productOptions,
      addButton,
      stockStatus,
    ),
  );
  Root.appendChild(Layout);
}
