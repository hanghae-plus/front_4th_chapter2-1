import { ProductModel } from '../models/product.model';

export const products = [
  ProductModel.createInstance('p1', '상품1', 10000, 50),
  ProductModel.createInstance('p2', '상품2', 20000, 30),
  ProductModel.createInstance('p3', '상품3', 30000, 20),
  ProductModel.createInstance('p4', '상품4', 15000, 0),
  ProductModel.createInstance('p5', '상품5', 25000, 10),
];
