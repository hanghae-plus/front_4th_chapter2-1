//Product
export type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

//CartItem
export type CartItem = {
  product: Product;
  quantity: number;
};
