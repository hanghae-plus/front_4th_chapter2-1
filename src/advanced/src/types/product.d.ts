type ProductId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5';

export type Product = {
  id: ProductId;
  name: string;
  value: number;
  quantity: number;
};
