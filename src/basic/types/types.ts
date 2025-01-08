export type Product = { id: string; name: string; price: number; stock: number };

export type Cart = {
  lastSaleItem: string | null;
  point: number;
  totalAmount: number;
  itemCount: number;
  productList: Product[];
};
