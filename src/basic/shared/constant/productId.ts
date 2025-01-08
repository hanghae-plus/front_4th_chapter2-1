import { Product } from '../entity/model/Product';

type ProductId = 'P1' | 'P2' | 'P3' | 'P4' | 'P5';

const PRODUCT_ID: { [key in ProductId]: Product['id'] } = {
  P1: 'p1',
  P2: 'p2',
  P3: 'p3',
  P4: 'p4',
  P5: 'p5',
};

export { PRODUCT_ID };
