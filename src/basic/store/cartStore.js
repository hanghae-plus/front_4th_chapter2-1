// 장바구니 관련 상태 관리
let lastSel = null;
let bonusPts = 0;
let totalAmt = 0;
let itemCnt = 0;

export const cartStore = {
  // getters
  getLastSel: () => lastSel,
  getBonusPts: () => bonusPts,
  getTotalAmt: () => totalAmt,
  getItemCnt: () => itemCnt,

  // setters
  setLastSel: (newLastSel) => {
    lastSel = newLastSel;
  },
  setCartState: ({ newBonusPts, newTotalAmt, newItemCnt }) => {
    bonusPts = newBonusPts;
    totalAmt = newTotalAmt;
    itemCnt = newItemCnt;
  },
};
