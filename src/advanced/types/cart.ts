export interface Product {
  id: string;
  name: string;
  val: number;
  q: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface DiscountResult {
  total: number;
  discountRate: number;
  items: Map<string, { quantity: number; product: Product }>;
}
