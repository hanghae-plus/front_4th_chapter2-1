import { useState } from 'react'
import type { Product } from '../lib/types'

interface UseProductsProps {
  initialProducts: Product[]
}

function useProducts({ initialProducts }: UseProductsProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)

  // 재고 업데이트
  const updateStock = (
    productId: string,
    quantity: number,
    type: 'add' | 'minus',
  ) => {
    setProducts((prev) =>
      prev.map((product) => {
        // 상품 아이디가 일치하면 재고 업데이트
        if (product.id === productId) {
          return {
            ...product,
            stock:
              type === 'add'
                ? product.stock + quantity
                : product.stock - quantity,
          }
        }
        // 상품 아이디가 일치하지 않으면 그대로 반환
        return product
      }),
    )
  }

  // 재고 확인
  const checkStock = (productId: string, quantity: number) => {
    // 상품 찾기
    const product = products.find((p) => p.id === productId)

    // 상품이 없거나 재고가 부족하면 알림 표시
    if (!product || quantity > product.stock) {
      alert('재고가 부족합니다.')
      return false
    }
    return true
  }

  return {
    products,
    updateStock,
    checkStock,
  }
}

export { useProducts }
