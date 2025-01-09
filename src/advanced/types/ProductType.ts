export interface ProductType {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ProductListType extends Array<ProductType> {}
