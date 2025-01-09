import { Product } from '../types/product';

interface UpdateQuantityInProductListParams {
  productList: Product[];
  selectedId: string;
  newQuantity: number;
}

export const updateQuantityInProductList = ({
  productList,
  selectedId,
  newQuantity,
}: UpdateQuantityInProductListParams) => {
  return productList.map((product) => {
    if (product.id === selectedId) {
      return {
        ...product,
        q: newQuantity,
      };
    }
    return product;
  });
};
