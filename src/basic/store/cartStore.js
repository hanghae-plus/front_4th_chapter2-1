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

  getCartState: () => ({
    lastSel,
    bonusPts,
    totalAmt,
    itemCnt,
  }),

  // setters
  setLastSel: (newLastSel) => {
    lastSel = newLastSel;
  },
  setCartState: ({ newBonusPts, newTotalAmt, newItemCnt }) => {
    bonusPts = newBonusPts ?? bonusPts;
    totalAmt = newTotalAmt ?? totalAmt;
    itemCnt = newItemCnt ?? itemCnt;
  },
};
