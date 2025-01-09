import { Product } from "../model";

interface GetProductsResponse {
  products: Product[];
}

export const getProducts = async () => {
  const response = await fetch("/products");
  const data: GetProductsResponse = await response.json();
  return data.products;
};
