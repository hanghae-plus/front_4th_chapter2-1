import { useState } from 'react'
import Cart from './components/Cart'
import ProductSelect from './components/product-select'
import { PRODUCTS } from './lib/constants'
import type { Cart as CartType, Product } from './lib/types'

function App() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS)
  const [cart, setCart] = useState<CartType[]>([])

  const handleAddCart = (productId: string) => {
    // 선택한 상품 정보 찾기
    const product = products.find((p) => p.id === productId)
    if (!product) {
      return
    }
    const addQuantity = 1
    const stock = product.stock
    console.log('🚀 ~ handleAddCart ~ stock:', stock)

    // 장바구니에 상품 있는지 확인
    const isProductInCart = cart.some((p) => p.id === productId)

    // 재고 없을 경우 종료
    if (!checkStock(addQuantity, stock)) {
      return
    }

    // 장바구니에 상품 있을 경우 수량 증가
    if (isProductInCart) {
      return handleAddQuantity(productId)
    }

    // 장바구니에 상품 없을 경우 상품 추가
    setCart([
      ...cart,
      {
        id: product.id,
        name: product.name,
        value: product.value,
        quantity: 1,
      },
    ])

    // 재고 업데이트
    updateStock(productId, addQuantity, 'minus')
  }

  const handleAddQuantity = (productId: string) => {
    // 선택한 상품 정보 찾기
    const product = products.find((p) => p.id === productId)
    if (!product) {
      return
    }

    // 상품 재고 확인
    const addQuantity = 1
    const stock = product.stock

    // 재고 없을 경우 종료
    if (!checkStock(addQuantity, stock)) {
      return
    }

    // 재고 있을 경우 장바구니 업데이트
    const updatedCart = cart.map((cartItem) =>
      cartItem.id === productId
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem,
    )
    setCart(updatedCart)

    // 재고 업데이트
    updateStock(productId, addQuantity, 'minus')
  }

  const handleMinusQuantity = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) {
      return
    }

    const minusQuantity = 1
    const cartQuantity = cart.find((p) => p.id === productId)?.quantity
    if (!cartQuantity) {
      return
    }

    if (cartQuantity - minusQuantity <= 0) {
      return setCart(cart.filter((p) => p.id !== productId))
    }

    setCart(
      cart.map((cartItem) =>
        cartItem.id === productId
          ? { ...cartItem, quantity: cartItem.quantity - minusQuantity }
          : cartItem,
      ),
    )

    updateStock(productId, minusQuantity, 'add')
  }

  function updateStock(
    productId: string,
    addQuantity: number,
    type: 'add' | 'minus',
  ) {
    const updatedProduct = products.map((product) => {
      if (product.id === productId) {
        if (type === 'add') {
          return { ...product, stock: product.stock + addQuantity }
        } else {
          return { ...product, stock: product.stock - addQuantity }
        }
      }
      return product
    })
    setProducts(updatedProduct)
  }

  function checkStock(addQuantity: number, stock: number) {
    if (addQuantity > stock) {
      alert('재고가 부족합니다.')
      return false
    }
    return true
  }

  const handleClearCart = () => {
    setCart([])
  }

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <Cart
          cart={cart}
          handleMinusQuantity={handleMinusQuantity}
          handleAddQuantity={handleAddQuantity}
          handleClearCart={handleClearCart}
        />
        <ProductSelect products={products} handleAddCart={handleAddCart} />
        <div className="text-sm text-gray-500 mt-2">상품4: 품절</div>
      </div>
    </div>
  )
}

export default App
