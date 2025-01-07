import { Product } from '../types/Product';

const findProductById = (id: Product['id'], productList: Product[]) => {
  return productList.find((product) => product.id === id);
};

export { findProductById };
