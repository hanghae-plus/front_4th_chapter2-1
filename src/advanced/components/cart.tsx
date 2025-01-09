import { useCalculateCart } from '../hooks/use-calculate-cart'
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
  const { totalAmount, discountRate, points } = useCalculateCart(props)

  return (
    <div>
      <div>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <span>
              {item.name} - {item.value.toLocaleString()}원 x {item.quantity}
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
