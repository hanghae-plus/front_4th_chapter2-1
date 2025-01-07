export interface Product {
  id: string;
  name: string;
  val: number;
  qty: number;
}

export type Discount =
  | 'LUCKY_DISC'
  | 'ADDITIONAL_DISC'
  | 'BULK_DISC'
  | 'DAY_OF_THE_WEEK_DISC'
  | 'ITEM_DISC';

export type AlertingDiscount = Extract<
  Discount,
  'LUCKY_DISC' | 'ADDITIONAL_DISC'
>;
