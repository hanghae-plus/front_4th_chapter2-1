import { createElements } from "../../utils/createElements.js";

export default function MainContents(
  shoppingCart,
  cartTotalCost,
  productOptions,
  addButton,
  stockStatus,
) {
  const MainContents = createElements({
    tag: "div",
    className:
      "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8",
  });

  const Title = createElements({
    tag: "h1",
    className: "text-2xl font-bold mb-4",
    textContent: "장바구니",
  });

  // 자식노드
  MainContents.appendChild(Title);
  MainContents.appendChild(shoppingCart);
  MainContents.appendChild(cartTotalCost);
  MainContents.appendChild(productOptions);
  MainContents.appendChild(addButton);
  MainContents.appendChild(stockStatus);
  return MainContents;
}
