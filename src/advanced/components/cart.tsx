import { useEffect, useState } from 'react'
import {
  BULK_DISCOUNT_RATE,
  BULK_PURCHASE_THRESHOLD,
  PRODUCT_DISCOUNTS,
  TUESDAY_DISCOUNT_RATE,
} from '../lib/constants'
import type { Cart as CartType } from '../lib/types'

interface CartProps {
  cart: CartType[]
  handleMinusQuantity: (productId: string) => void
  handleAddQuantity: (productId: string) => void
  handleClearCart: () => void
}

function Cart(props: CartProps) {
  const { cart, handleMinusQuantity, handleAddQuantity, handleClearCart } =
    props

  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [discountRate, setDiscountRate] = useState<number>(0)
  const [points, setPoints] = useState<number>(0)

  const calculateDiscounts = (cart: CartType[]) => {
    let subtotal = 0
    let totalAfterItemDiscount = 0
    let itemCount = 0

    // 개별 상품 할인 계산
    cart.forEach((item) => {
      const itemTotal = item.value * item.quantity
      itemCount += item.quantity
      subtotal += itemTotal

      // 10개 이상 구매시 상품별 할인 적용
      if (item.quantity >= 10) {
        const discount =
          PRODUCT_DISCOUNTS[item.id as keyof typeof PRODUCT_DISCOUNTS] || 0
        totalAfterItemDiscount += itemTotal * (1 - discount)
      } else {
        totalAfterItemDiscount += itemTotal
      }
    })

    // 대량 구매 할인 검토
    let finalTotal = totalAfterItemDiscount
    let finalDiscountRate = (subtotal - totalAfterItemDiscount) / subtotal

    if (itemCount >= BULK_PURCHASE_THRESHOLD) {
      const bulkDiscountAmount = totalAfterItemDiscount * BULK_DISCOUNT_RATE
      const itemDiscountAmount = subtotal - totalAfterItemDiscount

      if (bulkDiscountAmount > itemDiscountAmount) {
        finalTotal = subtotal * (1 - BULK_DISCOUNT_RATE)
        finalDiscountRate = BULK_DISCOUNT_RATE
      }
    }

    // 화요일 할인 적용
    const isTuesday = new Date().getDay() === 2
    if (isTuesday) {
      finalTotal *= 1 - TUESDAY_DISCOUNT_RATE
      finalDiscountRate = Math.max(finalDiscountRate, TUESDAY_DISCOUNT_RATE)
    }

    return {
      total: Math.round(finalTotal),
      discountRate: finalDiscountRate * 100,
      points: Math.floor(finalTotal / 1000),
    }
  }

  useEffect(() => {
    const { total, discountRate, points } = calculateDiscounts(cart)
    setTotalAmount(total)
    setDiscountRate(discountRate)
    setPoints(points)
  }, [cart, calculateDiscounts])

  return (
    <div>
      <div>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <span>
              {item.name} - {item.value.toLocaleString()}원 x {item.quantity}개
            </span>
            <div className="flex items-center gap-x-1 [&>button]:text-white [&>button]:px-2 [&>button]:py-1 [&>button]:rounded">
              <button
                className="bg-blue-500"
                onClick={() => handleMinusQuantity(item.id)}
              >
                -
              </button>
              <button
                className="bg-blue-500"
                onClick={() => handleAddQuantity(item.id)}
              >
                +
              </button>
              <button className="bg-red-500" onClick={() => handleClearCart()}>
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-xl font-bold my-4">
        <span>총액: {totalAmount.toLocaleString()}원</span>

        {discountRate > 0 && (
          <span className="text-green-500">
            ({discountRate.toFixed(1)}% 할인 적용)
          </span>
        )}

        <span className="text-blue-500 ml-2">(포인트: {points})</span>
      </div>
    </div>
  )
}

export default Cart
