export interface IProduct {
  id: string;
  name: string;
  cost: number;
  stock: number;
  discount: number;
}
export interface ICart extends Omit<IProduct, "stock"> {
  count: number;
}
