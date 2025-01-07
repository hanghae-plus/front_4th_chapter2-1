import { Cart } from '@/types/types';

import { createState } from '@utils/createStore';

export const cartStore = createState<Cart>({
  lastSaleItem: null,
  bonusPoint: 0,
  totalAmount: 0,
  itemCount: 0,
  productList: [
    { id: 'p1', name: '상품1', price: 10000, volume: 50 },
    { id: 'p2', name: '상품2', price: 20000, volume: 30 },
    { id: 'p3', name: '상품3', price: 30000, volume: 20 },
    { id: 'p4', name: '상품4', price: 15000, volume: 0 },
    { id: 'p5', name: '상품5', price: 25000, volume: 10 },
  ],
});
