import { state } from '../store/globalStore';

export const specialSale = () => {
  const prodList = state.get('prodList');

  setTimeout(() => {
    setInterval(() => {
      let luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
      if (Math.random() < 0.3 && luckyItem.volume > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');

        state.set('prodList', [...prodList]);
      }
    }, 30000);
  }, Math.random() * 10000);
};

export const additionSale = () => {
  const prodList = state.get('prodList');
  const lastSel = state.get('lastSel');

  setTimeout(() => {
    setInterval(() => {
      if (lastSel) {
        let suggest = prodList.find((item) => {
          return item.id !== lastSel && item.volume > 0;
        });
        if (suggest) {
          suggest.price = Math.round(suggest.price * 0.95);
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );

          state.set('prodList', [...prodList]);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};
