export type Product = { id: string; name: string; price: number; stock: number };

export type Cart = {
  lastSaleItem: string | null;
  bonusPoint: number;
  totalAmount: number;
  itemCount: number;
  productList: Product[];
};
