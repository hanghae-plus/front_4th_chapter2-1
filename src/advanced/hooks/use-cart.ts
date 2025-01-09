import { useState } from 'react'
import type { Cart, Product } from '../lib/types'

interface UseCartProps {
  updateStock: (
    productId: string,
    quantity: number,
    type: 'add' | 'minus',
  ) => void
  checkStock: (productId: string, quantity: number) => boolean
  products: Product[]
}

function useCart({ updateStock, checkStock, products }: UseCartProps) {
  const [cart, setCart] = useState<Cart[]>([])

  // 장바구니 추가
  const addToCart = (productId: string) => {
    // 상품 찾기
    const product = products.find((p) => p.id === productId)
    if (!product) return

    // 재고 확인
    if (!checkStock(productId, 1)) return

    // 장바구니에 이미 있는 상품인지 확인 - 있으면 수량 증가
    const existingItem = cart.find((item) => item.id === productId)
    if (existingItem) {
      return addQuantity(productId)
    }

    // 장바구니에 상품 추가
    setCart((prev) => [
      ...prev,
      {
        id: product.id,
        name: product.name,
        value: product.value,
        quantity: 1,
      },
    ])

    // 재고 업데이트
    updateStock(productId, 1, 'minus')
  }

  // 수량 증가
  const addQuantity = (productId: string) => {
    // 재고 확인
    if (!checkStock(productId, 1)) return

    // 장바구니에 상품 수량 증가
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    )

    // 재고 업데이트
    updateStock(productId, 1, 'minus')
  }

  // 수량 감소
  const minusQuantity = (productId: string) => {
    // 장바구니에 상품 찾기
    const item = cart.find((item) => item.id === productId)
    if (!item) return

    // 수량이 1개 이하면 상품 삭제
    if (item.quantity === 1) {
      setCart((prev) => prev.filter((item) => item.id !== productId))
    } else {
      // 수량 감소
      setCart((prev) =>
        prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        ),
      )
    }

    // 재고 업데이트
    updateStock(productId, 1, 'add')
  }

  // 장바구니 비우기
  const clearCart = () => {
    // 재고 복원
    cart.forEach((item) => {
      updateStock(item.id, item.quantity, 'add')
    })

    // 장바구니 비우기
    setCart([])
  }

  return {
    cart,
    addToCart,
    addQuantity,
    minusQuantity,
    clearCart,
  }
}

export { useCart }
