import { Product } from "../model";

interface GetProductsResponse {
  products: Product[];
}

export const getProducts = async (): Promise<GetProductsResponse> => {
  const response = await fetch("/products");
  const json = await response.json();
  return json;
};
