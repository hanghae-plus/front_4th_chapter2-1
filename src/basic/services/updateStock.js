// 재고 정보 업데이트
export function updateStock() {
  let infoMessage = '';
  productList.forEach(function (item) {
    if (item.quantity < 5) {
      infoMessage +=
        item.name +
        ': ' +
        (item.quantity > 0 ? `재고 부족 (${item.quantity}개 남음)` : '품절') +
        '\n';
    }
  });
  stockInfo.textContent = infoMessage;
}
