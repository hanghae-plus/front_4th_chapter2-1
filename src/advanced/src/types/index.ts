export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  lastSelectedProductId: string | null;
  bonusPoints: number;
  totalAmount: number;
}
