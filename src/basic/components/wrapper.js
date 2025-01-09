import {
  Header,
  ProductSelect,
  AddToCartButton,
  CartDisplay,
  CartTotal,
  StockStatus,
} from ".";

export const wrapper = () => {
  const wrapperDiv = document.createElement("div");
  wrapperDiv.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";

  // 각 컴포넌트 함수를 호출하여 DOM 요소를 반환받음
  const headerElement = Header();
  const cartDisplayElement = CartDisplay();
  const cartTotalElement = CartTotal();
  const productSelectElement = ProductSelect();
  const addToCartButtonElement = AddToCartButton();
  const stockStatusElement = StockStatus();

  // 반환된 DOM 요소를 wrapperDiv에 추가
  wrapperDiv.appendChild(headerElement);
  wrapperDiv.appendChild(cartDisplayElement);
  wrapperDiv.appendChild(cartTotalElement);
  wrapperDiv.appendChild(productSelectElement);
  wrapperDiv.appendChild(addToCartButtonElement);
  wrapperDiv.appendChild(stockStatusElement);

  return wrapperDiv;
};
