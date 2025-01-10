import React, { ChangeEvent, MutableRefObject, useEffect, useRef, useState } from "react"

// @NOTE: 파일을 분리하면 좋은데 변경과정을 한눈에 파악하기 용이하게 한 파일에 작성했습니다.

// types.ts
interface Product {
  id: string
  name: string
  price: number
  stock: number
  discount: number
}

interface CartItem extends Product {
  quantity: number
}

type ProductId = Product["id"]

// constant.ts
const 할인율 = (percent: number) => 1 - percent / 100
const DISCOUNT_RATIO_번개세일 = 할인율(20)
const DISCOUNT_RATIO_추천세일 = 할인율(5)

const 번개세일확률 = 0.3

const 화요일 = 2
const 대량구매할인_제품개수 = 30
const 대량구매할인율 = 0.25
const 주간세일_할인율 = 0.1

// ---------------------------------------
// Entity Layer

// Product
const initProductList = [
  { id: "p1", name: "상품1", price: 10000, stock: 50, discount: 0.1 },
  { id: "p2", name: "상품2", price: 20000, stock: 30, discount: 0.15 },
  { id: "p3", name: "상품3", price: 30000, stock: 20, discount: 0.2 },
  { id: "p4", name: "상품4", price: 15000, stock: 0, discount: 0.05 },
  { id: "p5", name: "상품5", price: 25000, stock: 10, discount: 0.25 },
]

const changeProductStockOffset = (productList: Product[], productId: ProductId, change: number) => {
  return productList.map((p) => (p.id === productId ? { ...p, stock: p.stock + change } : p))
}

const updateProductPrice = (productList: Product[], productId: ProductId, change: number) => {
  return productList.map((p) => (p.id === productId ? { ...p, price: p.price + change } : p))
}

// Cart
const initCart: CartItem[] = []

const changeCartQuantityOffset = (cart: CartItem[], productId: ProductId, change: number) => {
  return cart.map((p) => (p.id === productId ? { ...p, quantity: p.quantity + change } : p))
}

const addCartItem = (cart: CartItem[], product: Product) => {
  return [...cart, { ...product, quantity: 1 }]
}

const removeCartItem = (cart: CartItem[], productId: ProductId) => {
  return cart.filter((p) => p.id !== productId)
}

// ---------------------------------------
// UseCase Layer

type AppState = {
  productList: Product[]
  cart: CartItem[]
}

type SetState = React.Dispatch<React.SetStateAction<AppState>>

// 장바구니 가격 계산
const useCartSummary = (state: AppState) => {
  const subTotalAmount = state.cart.reduce((subTotalAmount, { price, quantity }) => {
    return subTotalAmount + price * quantity
  }, 0)

  // 총합
  let totalAmount = state.cart.reduce((totalAmount, { price, quantity, discount }) => {
    const itemTotalPrice = price * quantity
    const itemDiscountRate = quantity >= 10 ? discount : 0
    return totalAmount + itemTotalPrice * (1 - itemDiscountRate)
  }, 0)

  // 할인율
  let discountRate = (subTotalAmount - totalAmount) / subTotalAmount

  // 30개이상 대량 구매 할일
  const numCartItems = state.cart.reduce((itemCnt, { quantity }) => itemCnt + quantity, 0)
  if (numCartItems >= 대량구매할인_제품개수) {
    const bulkDiscountRate = totalAmount * 대량구매할인율
    const itemDiscountRate = subTotalAmount - totalAmount

    if (bulkDiscountRate > itemDiscountRate) {
      totalAmount = subTotalAmount * (1 - 대량구매할인율)
      discountRate = 대량구매할인율
    }
  }

  // 화요일 할일
  if (new Date().getDay() === 화요일) {
    totalAmount *= 1 - 주간세일_할인율
    discountRate = Math.max(discountRate, 주간세일_할인율)
  }

  // 장바구니 포인트
  const bonusPoint = Math.floor(totalAmount / 1000)

  return {
    discountRate,
    totalAmount,
    bonusPoint,
  }
}

// 카트에 담기
function addToCart(setState: SetState, state: AppState, product: Product) {
  const cartItem = state.cart.find((item) => item.id === product.id)

  // 장바구니에 이미 있다면 수량 올리기
  if (cartItem) {
    setState({
      ...state,
      productList: changeProductStockOffset(state.productList, product.id, -1),
      cart: changeCartQuantityOffset(state.cart, product.id, +1),
    })
  }
  // 아니면 카드에 추가
  else {
    setState({
      ...state,
      productList: changeProductStockOffset(state.productList, product.id, -1),
      cart: addCartItem(state.cart, product),
    })
  }
}

// 카트 수량 변경
function changeCartItemQty(setState: SetState, state: AppState, cartItem: CartItem, qtyChange: number) {
  // 수량이 없으면 제거
  if (cartItem.quantity + qtyChange <= 0) {
    setState({
      ...state,
      productList: changeProductStockOffset(state.productList, cartItem.id, -qtyChange),
      cart: removeCartItem(state.cart, cartItem.id),
    })
    return
  }

  // 정상적인 수량변경
  setState({
    ...state,
    productList: changeProductStockOffset(state.productList, cartItem.id, -qtyChange),
    cart: changeCartQuantityOffset(state.cart, cartItem.id, qtyChange),
  })
}

// 카트에서 물품 제거
function removeItemFromCart(setState: SetState, state: AppState, productId: ProductId) {
  const cartItem = state.cart.find((item) => item.id === productId)
  if (!cartItem) return
  setState({
    ...state,
    productList: changeProductStockOffset(state.productList, productId, +cartItem.quantity),
    cart: removeCartItem(state.cart, productId),
  })
}

// 번개세일
function useEffectSaleFlash(setState: SetState, state: AppState) {
  setTimeout(() => {
    setInterval(() => {
      const luckyItem = state.productList[Math.floor(Math.random() * state.productList.length)]
      if (Math.random() < 번개세일확률 && luckyItem.stock > 0) {
        const luckyItemPrice = Math.round(luckyItem.price * DISCOUNT_RATIO_번개세일)
        setState({ ...state, productList: updateProductPrice(state.productList, luckyItem.id, luckyItemPrice) })
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`)
      }
    }, 30000)
  }, Math.random() * 10000)
}

// 추천세일
function useEffectSaleRecommend(
  setState: SetState,
  state: AppState,
  lastSelectedProductIdRef: MutableRefObject<ProductId>,
) {
  setTimeout(() => {
    setInterval(() => {
      if (lastSelectedProductIdRef.current) {
        const suggest = state.productList.find((item) => item.id !== lastSelectedProductIdRef.current && item.stock > 0)
        if (suggest) {
          const suggestPrice = Math.round(suggest.price * DISCOUNT_RATIO_추천세일)
          setState({ ...state, productList: updateProductPrice(state.productList, suggest.id, suggestPrice) })
          alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`)
        }
      }
    }, 60000)
  }, Math.random() * 20000)
}

// React App
function App() {
  const [state, setState] = useState<AppState>({
    productList: initProductList,
    cart: initCart,
  })

  const selectedProductIdRef = useRef<ProductId>(initProductList[0].id)

  const cart = state.cart
  const productList = state.productList

  // computed
  const { totalAmount, discountRate, bonusPoint } = useCartSummary(state)
  const displayTotalAmount = Math.round(totalAmount)
  const displayDiscRate = (discountRate * 100).toFixed(1)

  // 상품 선택
  function handleSelectProduct(e: ChangeEvent<HTMLSelectElement>) {
    selectedProductIdRef.current = e.target.value
  }

  // 카트에 추가
  function handleAddProductToCart() {
    const product = state.productList.find((p) => p.id === selectedProductIdRef.current)

    // 재고부족 확인
    if (!product || product.stock <= 0) {
      alert("재고가 부족합니다.")
      return
    }

    addToCart(setState, state, product)
  }

  // 카트항목 수량변경
  function handleChangeQty(cartItem: CartItem, quantityOffset: number) {
    // 재고부족 확인
    const product = productList.find((p) => p.id === cartItem.id)
    if (!product || (quantityOffset > 0 && product.stock <= 0)) {
      alert("재고가 부족합니다.")
      return
    }

    changeCartItemQty(setState, state, cartItem, quantityOffset)
  }

  // 카트에서 제거
  function handleRemoveItemFromCart(cartItem: CartItem) {
    removeItemFromCart(setState, state, cartItem.id)
  }

  // 번개세일
  useEffect(() => useEffectSaleFlash(setState, state), [])

  // 추천세일
  useEffect(() => useEffectSaleRecommend(setState, state, selectedProductIdRef), [])

  // UI
  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 id="title" className="text-2xl font-bold mb-4">
          장바구니
        </h1>

        <div id="cart-items">
          {cart.map((cartItem) => (
            <div id={cartItem.id} className="flex justify-between items-center mb-2" key={cartItem.id}>
              <span>
                {cartItem.name} - {cartItem.price}원 x {cartItem.quantity}
              </span>
              <div>
                <button
                  className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  onClick={() => handleChangeQty(cartItem, -1)}
                >
                  -
                </button>
                <button
                  className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  onClick={() => handleChangeQty(cartItem, +1)}
                >
                  +
                </button>
                <button
                  className="remove-item bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleRemoveItemFromCart(cartItem)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>

        <div id="cart-total" className="text-xl font-bold my-4">
          총액: {displayTotalAmount}원
          {discountRate > 0 && <span className="text-green-500 ml-2">({displayDiscRate}% 할인 적용)</span>}
          <span id="loyalty-points" className="text-blue-500 ml-2">
            (포인트: {bonusPoint})
          </span>
        </div>

        <select
          id="product-select"
          data-testid="product-select"
          className="border rounded p-2 mr-2"
          onChange={handleSelectProduct}
        >
          {productList.map((item) => (
            <option value={item.id} disabled={item.stock === 0} key={item.id}>
              {item.name} - {item.price}원
            </option>
          ))}
        </select>

        <button id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddProductToCart}>
          추가
        </button>

        <div id="stock-status" className="text-sm text-gray-500 mt-2">
          {productList.map((item) =>
            item.stock < 5 ? `${item.name}: ${item.stock > 0 ? `재고 부족 (${item.stock}개 남음)` : "품절"}` : "",
          )}
        </div>
      </div>
    </div>
  )
}

export default App
