import { updateSelectableOptionsDisplay } from './index.js';

// 일정 시간 뒤 랜덤 상품을 20% 할인하는 번개세일
export function setupLightningSale({ SelectedProdComponent, prodList }) {
  setTimeout(() => {
    setInterval(() => {
      const luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
      if (Math.random() < 0.3 && luckyItem.qty > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');

        // selectBox 옵션도 갱신
        updateSelectableOptionsDisplay({
          selectedPropComponent: SelectedProdComponent,
          items: prodList,
        });
      }
    }, 30000); // 30초마다
  }, Math.random() * 10000); // 0~10초 후에 setInterval 시작
}

// 최근 선택된 상품을 제외하고 랜덤 추천 상품 5% 할인
export function setupSuggestions({ SelectedProdComponent, prodList, lastSelectedIdRef }) {
  setTimeout(() => {
    setInterval(() => {
      if (lastSelectedIdRef.value) {
        const suggest = prodList.find(p => p.id !== lastSelectedIdRef.value && p.qty > 0);
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.val = Math.round(suggest.val * 0.95);

          updateSelectableOptionsDisplay({
            selectedPropComponent: SelectedProdComponent,
            items: prodList,
          });
        }
      }
    }, 60000); // 1분마다
  }, Math.random() * 20000); // 0~20초 후에 setInterval 시작
}
