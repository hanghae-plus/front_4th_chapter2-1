export let prodList = [
  { id: "p1", name: "상품1", val: 10000, q: 50 },
  { id: "p2", name: "상품2", val: 20000, q: 30 },
  { id: "p3", name: "상품3", val: 30000, q: 20 },
  { id: "p4", name: "상품4", val: 15000, q: 0 },
  { id: "p5", name: "상품5", val: 25000, q: 10 },
];
export const setProdList = (val) => {
  prodList = val;
};

export let lastSel = null;
export const setLastSel = (val) => {
  lastSel = val;
};

export let totalAmt = 0;
export const setTotalAmt = (val) => {
  totalAmt = val;
};

export let itemCnt = 0;
export const setItemCnt = (val) => {
  itemCnt = val;
};

export let subTot = 0;
export const setSubTot = (val) => {
  subTot = val;
};
