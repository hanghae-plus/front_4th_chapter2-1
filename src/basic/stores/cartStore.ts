import { Cart } from '@/basic/types/types';
import { createState } from '@/basic/utils/createStore';

export const cartStore = createState<Cart>({
  lastSaleItem: null,
  totalAmount: 0,
  itemCount: 0,
  discountRate: 0,
  productList: [
    { id: 'p1', name: '상품1', price: 10000, stock: 50 },
    { id: 'p2', name: '상품2', price: 20000, stock: 30 },
    { id: 'p3', name: '상품3', price: 30000, stock: 20 },
    { id: 'p4', name: '상품4', price: 15000, stock: 0 },
    { id: 'p5', name: '상품5', price: 25000, stock: 10 },
  ],
});
