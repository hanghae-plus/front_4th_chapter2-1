import { ProductListType } from '../types/ProductsType';

export const initialProductList: ProductListType = [
  { id: 'p1', name: '상품1', price: 10_000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20_000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30_000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15_000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25_000, quantity: 10 },
] as const;
