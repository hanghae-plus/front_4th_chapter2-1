/*
체크리스트 진행단계

코드가 Prettier를 통해 일관된 포맷팅이 적용되어 있는가?
적절한 줄바꿈과 주석을 사용하여 코드의 논리적 단위를 명확히 구분했는가?
ES6+ 문법을 활용하여 코드를 더 간결하고 명확하게 작성했는가?

- prettier 설치, 모양잡기
- 엔터추가
- 주석추가
- const -> let
- function을 arrow로
- 문자열을 템플릿

변수명과 함수명이 그 역할을 명확히 나타내며, 일관된 네이밍 규칙을 따르는가?
매직 넘버와 문자열을 의미 있는 상수로 추출했는가?
중복 코드를 제거하고 재사용 가능한 형태로 리팩토링했는가?
함수가 단일 책임 원칙을 따르며, 한 가지 작업만 수행하는가?
조건문과 반복문이 간결하고 명확한가? 복잡한 조건을 함수로 추출했는가?

- 상수들을 설정
- let를 최대한 제거하고 const 말들기
- for문을 가급적 forEach로 만들고 이후 map, reduce등으로 변경할 준비
- 복잡한 for문보다 find 등
- render와 calc를 구분할 수 있도록 DOM처리와 비즈니스 로직 부분을 분리

코드의 배치가 의존성과 실행 흐름에 따라 논리적으로 구성되어 있는가?
연관된 코드를 의미 있는 함수나 모듈로 그룹화했는가?
전역 상태와 부수 효과(side effects)를 최소화했는가?

- state를 만들고 render를 분리해서 동작할 수 있게
- 가급적 전역변수를 제거하고 로컬 변수로 활용한 방안
- let을 통한 데이터 변경을 최소화해서 const x = getX() 와 같이 한번에 받을 수 있도록

에러 처리와 예외 상황을 명확히 고려하고 처리했는가?
코드 자체가 자기 문서화되어 있어, 주석 없이도 의도를 파악할 수 있는가?
비즈니스 로직과 UI 로직이 적절히 분리되어 있는가?
객체지향 또는 함수형 프로그래밍 원칙을 적절히 적용했는가?
코드의 각 부분이 테스트 가능하도록 구조화되어 있는가?

- state를 이용한 계산로직과 렌더링 로직을 분리
- state의 변화를 최소화 하고 유도되는 값을 처리 let과 대입보다는 const와 함수처리
- 그룹이 쪼개어 분리가능한 코드들을 함수로 관리하도록 수정


- 성능 개선을 위해 불필요한 연산이나 렌더링을 제거했는가?
- 새로운 기능 추가나 변경이 기존 코드에 미치는 영향을 최소화했는가?
- 리팩토링 시 기존 기능을 그대로 유지하면서 점진적으로 개선했는가?
- 코드 리뷰를 통해 다른 개발자들의 피드백을 반영하고 개선했는가?
 */

const 할인율 = (percent) => 1 - percent / 100
const DISCOUNT_RATIO_번개세일 = 할인율(20)
const DISCOUNT_RATIO_추천세일 = 할인율(5)
const 화요일 = 2
const 대량구매할인_제품개수 = 30

let addBtn, cartDisp
let lastSel

// 상품정보
const productList = [
  { id: "p1", name: "상품1", val: 10000, q: 50, discount: 0.1 },
  { id: "p2", name: "상품2", val: 20000, q: 30, discount: 0.15 },
  { id: "p3", name: "상품3", val: 30000, q: 20, discount: 0.2 },
  { id: "p4", name: "상품4", val: 15000, q: 0, discount: 0.05 },
  { id: "p5", name: "상품5", val: 25000, q: 10, discount: 0.25 },
]

const $ = (selector) => document.body.querySelector(selector)

let state = {
  cart: [],
}

function setState(newState) {
  state = { ...state, ...newState }
  render()
}

// 장바구니 가격 계산
function calcCart() {
  console.log("state.cart", state.cart)

  const subTot = state.cart.reduce((subTot, { val, quantity }) => {
    return subTot + val * quantity
  }, 0)

  let totalAmount = state.cart.reduce((totalAmount, { val, quantity, discount }) => {
    const itemTot = val * quantity
    const disc = quantity >= 10 ? discount : 0
    return totalAmount + itemTot * (1 - disc)
  }, 0)

  // @TODO: discRate, totalAmount
  let discRate = (subTot - totalAmount) / subTot

  // 30개이상 대량 구매 할일
  const itemCnt = state.cart.reduce((itemCnt, { quantity }) => itemCnt + quantity, 0)
  if (itemCnt >= 대량구매할인_제품개수) {
    const bulkDisc = totalAmount * 0.25
    const itemDisc = subTot - totalAmount
    if (bulkDisc > itemDisc) {
      totalAmount = subTot * (1 - 0.25)
      discRate = 0.25
    }
  }

  // 화요일 할일
  if (new Date().getDay() === 화요일) {
    totalAmount *= 1 - 0.1
    discRate = Math.max(discRate, 0.1)
  }

  // [계산] 장바구니 포인트 계산
  const bonusPoint = Math.floor(totalAmount / 1000)

  return {
    discRate,
    totalAmount,
    bonusPoint,
  }
}

function main() {
  // View
  const root = document.getElementById("app")
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
  addBtn = root.querySelector("#add-to-cart")
  addBtn.addEventListener("click", handleAddProductToCart)

  // 행동 - 장바구니 수량 변경
  cartDisp = root.querySelector("#cart-items")
  cartDisp.addEventListener("click", handleChangeQty)
  cartDisp.addEventListener("click", handleRemoveItem)

  // use번개세일()
  // useSaleRecommend()

  //
  render()
}

// 번개세일
function use번개세일() {
  setTimeout(() => {
    // return
    setInterval(() => {
      const luckyItem = productList[Math.floor(Math.random() * productList.length)]
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * DISCOUNT_RATIO_번개세일)
        // @TODO: productList를 state로 관리하기
        setState()

        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`)
      }
    }, 30000)
  }, Math.random() * 10000)
}

// 추천세일
function useSaleRecommend() {
  setTimeout(() => {
    // return
    setInterval(() => {
      if (lastSel) {
        const suggest = productList.find((item) => item.id !== lastSel && item.q > 0)
        if (suggest) {
          suggest.val = Math.round(suggest.val * DISCOUNT_RATIO_추천세일)
          // @TODO: productList를 state로 관리하기
          setState()

          alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`)
        }
      }
    }, 60000)
  }, Math.random() * 20000)
}

function render() {
  const { totalAmount, discRate, bonusPoint } = calcCart()

  const displayTotalAmount = Math.round(totalAmount)
  const displayDiscRate = (discRate * 100).toFixed(1)

  // 목록 출려
  const sel = $("#product-select")
  const v = sel.value
  sel.innerHTML = productList.map(
    (item) => `
    <option value="${item.id}" ${item.q === 0 ? "disabled" : ""}>${item.name} - ${item.val}원</option>
  `,
  )
  if (v) sel.value = v

  // 카트 총액
  $("#cart-total").innerHTML =
    `총액: ${displayTotalAmount}원` +
    `${discRate > 0 ? `<span class="text-green-500 ml-2">(${displayDiscRate}% 할인 적용)</span>` : ""}` +
    `<span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${bonusPoint})</span>`

  // 재고 출력
  $("#stock-status").textContent = productList
    .map((item) => (item.q < 5 ? `${item.name}: ${item.q > 0 ? `재고 부족 (${item.q}개 남음)` : "품절"}` : ""))
    .join("")

  $("#cart-items").innerHTML = state.cart
    .map(
      (itemToAdd) => `
<div id="${itemToAdd.id}" class="flex justify-between items-center mb-2">
    <span>${itemToAdd.name} - ${itemToAdd.val}원 x ${itemToAdd.quantity}</span>
  <div>
    <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
    <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
    <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
  </div>
</div>`,
    )
    .join("")
}

function handleAddProductToCart() {
  const selItem = $("#product-select").value
  const itemToAdd = productList.find((p) => p.id === selItem)
  if (!itemToAdd || itemToAdd.q <= 0) {
    // 재고부족
    alert("재고가 부족합니다.")
    return
  }

  const cartItem = state.cart.find((product) => product.id === selItem)
  if (cartItem) {
    // @TODO: 전역데이터 변경 state로 변경하기
    itemToAdd.q--

    setState({
      cart: state.cart.map((p) => (p.id === selItem ? { ...p, quantity: p.quantity + 1 } : p)),
    })
  } else {
    // @TODO: 전역데이터 변경 state로 변경하기
    itemToAdd.q--

    setState({
      cart: [...state.cart, { ...itemToAdd, quantity: 1 }],
    })
  }

  lastSel = selItem
}

function handleChangeQty(event) {
  const target = event.target
  if (!target.classList.contains("quantity-change")) {
    return
  }

  const productId = target.dataset.productId
  const product = productList.find((p) => p.id === productId)

  // 수량 변경
  const qtyChange = parseInt(target.dataset.change)
  const cartItem = state.cart.find((product) => product.id === productId)
  const newQty = cartItem.quantity + qtyChange

  if (newQty > 0 && newQty <= product.q + cartItem.quantity) {
    // @FIXME:
    product.q -= qtyChange

    setState({
      cart: state.cart.map((p) => (p.id === productId ? { ...p, quantity: newQty } : p)),
    })
  }

  // 수량이 없으면 제거
  else if (newQty <= 0) {
    // @FIXME:
    product.q -= qtyChange

    setState({
      cart: state.cart.filter((p) => p.id !== productId),
    })
  }

  // 재고부족 알림
  else {
    alert("재고가 부족합니다.")
  }
}

function handleRemoveItem(event) {
  const target = event.target
  if (!target.classList.contains("remove-item")) {
    return
  }

  const productId = target.dataset.productId
  setState({
    cart: state.cart.filter((p) => p.id !== productId),
  })
}

// 메인
main()
