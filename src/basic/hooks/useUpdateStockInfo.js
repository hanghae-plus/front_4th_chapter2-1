import { prodList } from "../common/state";

export function useUpdateStockInfo() {
  const StockStatus = document.getElementById("stock-status");
  var infoMsg = "";
  prodList.forEach(function (item) {
    if (item.q < 5) {
      infoMsg +=
        item.name +
        ": " +
        (item.q > 0 ? "재고 부족 (" + item.q + "개 남음)" : "품절") +
        "\n";
    }
  });
  StockStatus.textContent = infoMsg;
}
