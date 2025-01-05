type Product = {
  id: string;
  name: string;
  originalPrice: number;
  quantity: number;
};

export const products: Product[] = [
  { id: 'p1', name: '상품1', originalPrice: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', originalPrice: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', originalPrice: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', originalPrice: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', originalPrice: 25000, quantity: 10 },
];
