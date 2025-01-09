export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface CartItem {
  id: string;
  quantity: number;
}

export interface CartState {
  lastSelectedProduct: string | null;
  bonusPoints: number;
  itemCount: number;
}

export interface CartTotals {
  subTotal: number;
  totalAmount: number;
  itemCount: number;
  discount: number;
}

export interface PromotionConfig {
  FLASH_SALE: {
    INTERVAL: number;
    INITIAL_DELAY: number;
    PROBABILITY: number;
    DISCOUNT_RATE: number;
  };
  RECOMMENDATION: {
    INTERVAL: number;
    INITIAL_DELAY: number;
    DISCOUNT_RATE: number;
  };
}
