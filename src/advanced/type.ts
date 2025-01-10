export interface Product {
  id: string;
  name: string;
  val: number;
  qty: number;
}

export interface CartItem {
  id: string;
  qty: number;
}

export type Discount =
  | 'LUCKY_DISC'
  | 'ADDITIONAL_DISC'
  | 'BULK_DISC'
  | 'DAY_OF_THE_WEEK_DISC'
  | 'ITEM_DISC';

export type IndividualDiscount = Extract<
  Discount,
  'LUCKY_DISC' | 'ADDITIONAL_DISC'
>;
