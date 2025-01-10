export interface Product {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface CartUIElements {
  productSelect: HTMLSelectElement | null;
  addCartBtn: HTMLButtonElement | null;
  cartDisplay: HTMLDivElement | null;
  cartTotalPrice: HTMLDivElement | null;
  stockStatus: HTMLDivElement | null;
}

export interface Cart {
  bonusPoints: number;
  totalAmt: number;
  itemCnt: number;
}

export type CartWithElements = Cart & CartUIElements;
