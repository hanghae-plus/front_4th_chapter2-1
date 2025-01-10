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

// utils.ts
const $ = (selector: string) => document.body.querySelector(selector) as HTMLElement

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
const productList = [
  { id: "p1", name: "상품1", price: 10000, stock: 50, discount: 0.1 },
  { id: "p2", name: "상품2", price: 20000, stock: 30, discount: 0.15 },
  { id: "p3", name: "상품3", price: 30000, stock: 20, discount: 0.2 },
  { id: "p4", name: "상품4", price: 15000, stock: 0, discount: 0.05 },
  { id: "p5", name: "상품5", price: 25000, stock: 10, discount: 0.25 },
]

const updateProductStock = (productList: Product[], productId: ProductId, change: number) => {
  return productList.map((p) => (p.id === productId ? { ...p, stock: p.stock + change } : p))
}

const updateProductPrice = (productList: Product[], productId: ProductId, change: number) => {
  return productList.map((p) => (p.id === productId ? { ...p, price: p.price + change } : p))
}

// Cart
const cart: CartItem[] = []

const updateCartQuantityOffset = (cart: CartItem[], productId: ProductId, change: number) => {
  return cart.map((p) => (p.id === productId ? { ...p, quantity: p.quantity + change } : p))
}

const addCartItem = (cart: CartItem[], product: Product) => {
  return [...cart, { ...product, quantity: 1 }]
}

const removeCartItem = (cart: CartItem[], productId: ProductId) => {
  return cart.filter((p) => p.id !== productId)
}

// 장바구니 기본 가격 계산 (할인 전)
const calculateSubTotal = (cart: CartItem[]) =>
  cart.reduce((subTotal, { price, quantity }) => subTotal + price * quantity, 0)

const calculateTotalAndDiscount = (cart: CartItem[]) => {
  const subTotalAmount = calculateSubTotal(state.cart)

  // 총합
  let totalAmount = cart.reduce((totalAmount, { price, quantity, discount }) => {
    const itemTotalPrice = price * quantity
    const itemDiscountRate = quantity >= 10 ? discount : 0
    return totalAmount + itemTotalPrice * (1 - itemDiscountRate)
  }, 0)

  // 할인율
  let discountRate = (subTotalAmount - totalAmount) / subTotalAmount

  // 1) 30개이상 대량 구매 할인
  const numCartItems = state.cart.reduce((itemCnt, { quantity }) => itemCnt + quantity, 0)

  if (numCartItems >= 대량구매할인_제품개수) {
    const bulkDiscountRate = totalAmount * 대량구매할인율
    const itemDiscountRate = subTotalAmount - totalAmount

    if (bulkDiscountRate > itemDiscountRate) {
      totalAmount = subTotalAmount * (1 - 대량구매할인율)
      discountRate = 대량구매할인율
    }
  }

  // 2) 화요일 할인
  if (new Date().getDay() === 화요일) {
    totalAmount *= 1 - 주간세일_할인율
    discountRate = Math.max(discountRate, 주간세일_할인율)
  }

  return { totalAmount, discountRate }
}

// 포인트 계산
const calculateBonusPoints = (totalAmount: number) => Math.floor(totalAmount / 1000)

// ---------------------------------------
// feature Layer
type AppState = {
  productList: Product[]
  cart: CartItem[]
}

let lastSelectedProductIdRef: ProductId

let state: AppState = {
  productList,
  cart,
}

function setState(newState: Partial<typeof state>) {
  // console.group("")
  // console.log("prev state", state)
  state = { ...state, ...newState }
  // console.log("next state", state)
  // console.groupEnd()
  render(state)
}

// 장바구니 가격 계산
function useCartSummary(state: AppState) {
  // 장바구니 총합
  const { totalAmount, discountRate } = calculateTotalAndDiscount(state.cart)

  // 장바구니 포인트
  const bonusPoint = calculateBonusPoints(totalAmount)

  return {
    totalAmount,
    discountRate,
    bonusPoint,
  }
}

// 카트에 담기
function addToCart(state: AppState, product: Product) {
  const cartItem = state.cart.find((item) => item.id === product.id)

  // 장바구니에 이미 있다면 수량 올리기
  if (cartItem) {
    setState({
      productList: updateProductStock(state.productList, product.id, -1),
      cart: updateCartQuantityOffset(state.cart, product.id, +1),
    })
  }
  // 아니면 카드에 추가
  else {
    setState({
      productList: updateProductStock(state.productList, product.id, -1),
      cart: addCartItem(state.cart, product),
    })
  }
}

// 카트 수량 변경
function changeCartItemQty(state: AppState, cartItem: CartItem, qtyChange: number) {
  // 수량이 없으면 제거
  if (cartItem.quantity + qtyChange <= 0) {
    setState({
      productList: updateProductStock(state.productList, cartItem.id, -qtyChange),
      cart: removeCartItem(state.cart, cartItem.id),
    })
    return
  }

  // 정상적인 수량변경
  setState({
    productList: updateProductStock(state.productList, cartItem.id, -qtyChange),
    cart: updateCartQuantityOffset(state.cart, cartItem.id, qtyChange),
  })
}

// 카트에서 물품 제거
function removeItemFromCart(state: AppState, productId: ProductId) {
  setState({
    cart: removeCartItem(state.cart, productId),
  })
}

// ---------------------------------------
// UI Layer

function render(state: AppState) {
  const { totalAmount, discountRate, bonusPoint } = useCartSummary(state)

  const displayTotalAmount = Math.round(totalAmount)
  const displayDiscRate = (discountRate * 100).toFixed(1)

  // 목록 출력
  const sel = $("#product-select") as HTMLSelectElement
  const v = sel.value
  sel.innerHTML = state.productList
    .map(
      (item) =>
        `<option value="${item.id}" ${item.stock === 0 ? "disabled" : ""}>${item.name} - ${item.price}원</option>`,
    )
    .join("")
  if (v) sel.value = v

  // 카트 총액
  $("#cart-total").innerHTML =
    `총액: ${displayTotalAmount}원` +
    `${discountRate > 0 ? `<span class="text-green-500 ml-2">(${displayDiscRate}% 할인 적용)</span>` : ""}` +
    `<span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${bonusPoint})</span>`

  // 재고 출력
  $("#stock-status").textContent = state.productList
    .map((item) =>
      item.stock < 5 ? `${item.name}: ${item.stock > 0 ? `재고 부족 (${item.stock}개 남음)` : "품절"}` : "",
    )
    .join("")

  $("#cart-items").innerHTML = state.cart
    .map(
      (cartItem) => `
<div id="${cartItem.id}" class="flex justify-between items-center mb-2">
    <span>${cartItem.name} - ${cartItem.price}원 x ${cartItem.quantity}</span>
  <div>
    <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${cartItem.id}" data-change="-1">-</button>
    <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${cartItem.id}" data-change="1">+</button>
    <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${cartItem.id}">삭제</button>
  </div>
</div>`,
    )
    .join("")
}

// 번개세일
function useEffectSaleFlash() {
  setTimeout(() => {
    // return
    setInterval(() => {
      const luckyItem = state.productList[Math.floor(Math.random() * state.productList.length)]
      if (Math.random() < 번개세일확률 && luckyItem.stock > 0) {
        const luckyItemPrice = Math.round(luckyItem.price * DISCOUNT_RATIO_번개세일)
        setState({ productList: updateProductPrice(productList, luckyItem.id, luckyItemPrice) })
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`)
      }
    }, 30000)
  }, Math.random() * 10000)
}

// 추천세일
function useEffectSaleRecommend() {
  setTimeout(() => {
    // return
    setInterval(() => {
      if (lastSelectedProductIdRef) {
        const suggest = state.productList.find((item) => item.id !== lastSelectedProductIdRef && item.stock > 0)
        if (suggest) {
          const suggestPrice = Math.round(suggest.price * DISCOUNT_RATIO_추천세일)
          setState({ productList: updateProductPrice(productList, suggest.id, suggestPrice) })
          alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`)
        }
      }
    }, 60000)
  }, Math.random() * 20000)
}

function handleAddProductToCart() {
  const sel = $("#product-select") as HTMLSelectElement
  const selItem = sel.value
  lastSelectedProductIdRef = selItem

  const product = state.productList.find((p) => p.id === selItem)

  // 재고확인
  if (!product || product.stock <= 0) {
    alert("재고가 부족합니다.")
    return
  }

  addToCart(state, product)
}

function handleChangeQty(event: MouseEvent) {
  const target = event.target as HTMLDivElement
  if (!target.classList.contains("quantity-change")) {
    return
  }

  // 수량 변경
  const productId = target.dataset.productId
  const product = state.productList.find((p) => p.id === productId)
  if (!product) {
    return
  }

  const cartItem = state.cart.find((product) => product.id === productId)
  if (!cartItem) {
    return
  }

  const qtyChange = parseInt(target.dataset.change as string)
  const newQty = cartItem.quantity + qtyChange

  // 재고부족 확인
  if (newQty > product.stock + cartItem.quantity) {
    alert("재고가 부족합니다.")
    return
  }

  changeCartItemQty(state, cartItem, qtyChange)
}

function handleRemoveItemFromCart(event: MouseEvent) {
  const target = event.target as HTMLDivElement
  if (!target.classList.contains("remove-item")) {
    return
  }

  const productId = target.dataset.productId as string
  removeItemFromCart(state, productId)
}

function main(root: HTMLElement) {
  // View
  root.innerHTML = `
    <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 id="title" class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4"></div>
        <select id="product-select" class="border rounded p-2 mr-2"></select>
        <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
        <div id="stock-status" class="text-sm text-gray-500 mt-2"></div>
      </div>
    </div>
  `

  // 행동 - 장바구니에 상품 추가
  $("#add-to-cart").addEventListener("click", handleAddProductToCart)

  // 행동 - 장바구니 수량 변경
  $("#cart-items").addEventListener("click", handleChangeQty)
  $("#cart-items").addEventListener("click", handleRemoveItemFromCart)

  useEffectSaleFlash()
  useEffectSaleRecommend()

  //
  render(state)
}

// 메인
main(document.getElementById("app")!)
