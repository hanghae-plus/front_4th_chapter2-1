import { opt } from "../components";
import { prodList } from "../common/state";

export function useUpdateSelOpts() {
  const productSelectElement = document.getElementById("product-select");
  if (!productSelectElement) {
    console.error("product-select 요소를 찾을 수 없습니다.");
    return;
  }
  productSelectElement.innerHTML = "";
  prodList.forEach((item) => {
    const optComponent = opt(item);
    productSelectElement.appendChild(optComponent);
  });
}
