export type Product = { id: string; name: string; price: number; stock: number; quantity: number };

export type Cart = {
  lastSaleItem: string | null;
  totalAmount: number;
  discountRate: number;
  itemCount: number;
  productList: Product[];
};
