import { Cart } from '@/types/types';
import { createState } from '@/utils/createStore';

export const cartStore = createState<Cart>({
  lastSaleItem: null,
  totalAmount: 0,
  itemCount: 0,
  discountRate: 0,
  productList: [],
});
