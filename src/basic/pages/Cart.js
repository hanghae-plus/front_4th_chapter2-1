export const Cart = () => {
  // 질문할 요소.. 옵션 부요 관련 유틸함수를 만드는 것이 좋을까 ?
  // 아니면 Keep It simple stupid 형태로 접근.. ? 단순한것이 최고
  const $cartContainer = document.createElement("div");
  $cartContainer.className = "bg-gray-100 p-8";

  const $cartWrapper = document.createElement("div");
  $cartWrapper.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";

  return $cartContainer;
};
