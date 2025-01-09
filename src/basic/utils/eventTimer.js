export function eventTimer(productStore) {
  setupFlashSale(productStore);
  setupProductSuggestion(productStore);
}

// 번개 세일 설정
function setupFlashSale(productStore) {
  const { productList } = productStore.getState();

  setTimeout(() => {
    setInterval(() => {
      const luckyItem = productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
      }
    }, 30000);
  }, Math.random() * 10000);
}

// 추천 상품 알림 설정
function setupProductSuggestion(productStore) {
  const { productList, lastSelectedProductId } = productStore.getState();

  setTimeout(() => {
    setInterval(() => {
      if (lastSelectedProductId) {
        const suggest = productList.find(
          (item) => item.id !== lastSelectedProductId && item.quantity > 0
        );
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.price = Math.round(suggest.price * 0.95);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}
