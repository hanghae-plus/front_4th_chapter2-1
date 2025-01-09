import { Product } from './types'

const PRODUCTS: Product[] = [
  { id: 'p1', name: '상품1', value: 10000, stock: 50 },
  { id: 'p2', name: '상품2', value: 20000, stock: 30 },
  { id: 'p3', name: '상품3', value: 30000, stock: 20 },
  { id: 'p4', name: '상품4', value: 15000, stock: 0 },
  { id: 'p5', name: '상품5', value: 25000, stock: 10 },
] as const

// 상품별 할인율 정의
const PRODUCT_DISCOUNTS = {
  p1: 0.1, // 10%
  p2: 0.15, // 15%
  p3: 0.2, // 20%
  p4: 0.05, // 5%
  p5: 0.25, // 25%
} as const

// 대량 구매 할인율
const BULK_PURCHASE_THRESHOLD = 30
const BULK_DISCOUNT_RATE = 0.25 // 25%

// 화요일 할인율
const TUESDAY_DISCOUNT_RATE = 0.1 // 10%

const POINT_RULES = {
  BASIC_RATE: 0.001, // 기본 0.1% 적립
  TUESDAY_BONUS: 2, // 화요일 2배 적립
  BULK_PURCHASE_BONUS: 1.5, // 대량 구매시 1.5배 적립
  THRESHOLD_FOR_BONUS: 100000, // 10만원 이상 구매시 추가 보너스
  BONUS_POINTS: 1000, // 10만원 이상 구매시 1000포인트 추가
} as const

export {
  BULK_DISCOUNT_RATE,
  BULK_PURCHASE_THRESHOLD,
  POINT_RULES,
  PRODUCT_DISCOUNTS,
  PRODUCTS,
  TUESDAY_DISCOUNT_RATE,
}
