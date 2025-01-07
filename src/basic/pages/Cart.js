import {
  CartHeader,
  CartList,
  CartSummary,
  ProductSelect,
  ProductAddButton,
  StockInformation,
} from "../components/Cart";

export const Cart = () => {
  const $cartContainer = document.createElement("div");
  $cartContainer.className = "bg-gray-100 p-8";

  const $cartWrapper = document.createElement("div");
  $cartWrapper.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";

  // main.basic.js의 순서와 동일하게 컴포넌트 추가
  $cartWrapper.appendChild(CartHeader());
  $cartWrapper.appendChild(CartList());
  $cartWrapper.appendChild(CartSummary());
  $cartWrapper.appendChild(ProductSelect());
  $cartWrapper.appendChild(ProductAddButton());
  $cartWrapper.appendChild(StockInformation());

  $cartContainer.appendChild($cartWrapper);

  return $cartContainer;
};
