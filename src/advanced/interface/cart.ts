export interface Product {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface Cart {
  bonusPoints: number;
  totalAmt: number;
  itemCnt: number;
  cartDisplay: Array<Product>;
}
