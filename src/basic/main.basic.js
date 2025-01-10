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

- magic number들을 상수로 이름짓기
- let를 최대한 제거하고 const 말들기
- for문을 가급적 forEach로 만들고 이후 map, reduce등으로 변경할 준비
- 복잡한 for문보다 find 등
- render와 calc를 구분할 수 있도록 DOM처리와 비즈니스 로직 부분을 분리

- 코드의 배치가 의존성과 실행 흐름에 따라 논리적으로 구성되어 있는가?
- 연관된 코드를 의미 있는 함수나 모듈로 그룹화했는가?
- 전역 상태와 부수 효과(side effects)를 최소화했는가?
- 에러 처리와 예외 상황을 명확히 고려하고 처리했는가?
- 코드 자체가 자기 문서화되어 있어, 주석 없이도 의도를 파악할 수 있는가?
- 비즈니스 로직과 UI 로직이 적절히 분리되어 있는가?
- 객체지향 또는 함수형 프로그래밍 원칙을 적절히 적용했는가?
- 코드의 각 부분이 테스트 가능하도록 구조화되어 있는가?
- 성능 개선을 위해 불필요한 연산이나 렌더링을 제거했는가?
- 새로운 기능 추가나 변경이 기존 코드에 미치는 영향을 최소화했는가?
- 리팩토링 시 기존 기능을 그대로 유지하면서 점진적으로 개선했는가?
- 코드 리뷰를 통해 다른 개발자들의 피드백을 반영하고 개선했는가?
 */

const 할인율 = (percent) => 1 - percent / 100
const DISCOUNT_RATIO_번개세일 = 할인율(20)
const DISCOUNT_RATIO_추천세일 = 할인율(5)
const 화요일 = 2

let sel, addBtn, cartDisp, sum, stockInfo
let lastSel,
  totalAmount = 0,
  itemCnt = 0

// 상품정보
const productList = [
  { id: "p1", name: "상품1", val: 10000, q: 50, discount: 0.1 },
  { id: "p2", name: "상품2", val: 20000, q: 30, discount: 0.15 },
  { id: "p3", name: "상품3", val: 30000, q: 20, discount: 0.2 },
  { id: "p4", name: "상품4", val: 15000, q: 0, discount: 0.05 },
  { id: "p5", name: "상품5", val: 25000, q: 10, discount: 0.25 },
]

function main() {
  // View
  const root = document.getElementById("app")
  const cont = document.createElement("div")
  cont.className = "bg-gray-100 p-8"

  const wrap = document.createElement("div")
  wrap.className = "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8"

  const hTxt = document.createElement("h1")
  hTxt.className = "text-2xl font-bold mb-4"
  hTxt.textContent = "장바구니"

  cartDisp = document.createElement("div")
  cartDisp.id = "cart-items"

  sel = document.createElement("select")
  sel.id = "product-select"
  sel.className = "border rounded p-2 mr-2"
  renderSelOpts(productList)

  addBtn = document.createElement("button")
  addBtn.id = "add-to-cart"
  addBtn.className = "bg-blue-500 text-white px-4 py-2 rounded"
  addBtn.textContent = "추가"

  stockInfo = document.createElement("div")
  stockInfo.id = "stock-status"
  stockInfo.className = "text-sm text-gray-500 mt-2"

  sum = document.createElement("div")
  sum.id = "cart-total"
  sum.className = "text-xl font-bold my-4"

  wrap.appendChild(hTxt)
  wrap.appendChild(cartDisp)
  wrap.appendChild(sum)
  wrap.appendChild(sel)
  wrap.appendChild(addBtn)
  wrap.appendChild(stockInfo)
  cont.appendChild(wrap)
  root.appendChild(cont)

  // 장바구니 계산
  calcCart()

  // 번개세일
  setTimeout(() => {
    // return
    setInterval(() => {
      const luckyItem = productList[Math.floor(Math.random() * productList.length)]
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * DISCOUNT_RATIO_번개세일)
        renderSelOpts(productList)
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`)
      }
    }, 30000)
  }, Math.random() * 10000)

  // 추천세일
  setTimeout(() => {
    // return
    setInterval(() => {
      if (lastSel) {
        const suggest = productList.find((item) => item.id !== lastSel && item.q > 0)
        if (suggest) {
          suggest.val = Math.round(suggest.val * DISCOUNT_RATIO_추천세일)
          renderSelOpts(productList)
          alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`)
        }
      }
    }, 60000)
  }, Math.random() * 20000)
}

// 장바구니 가격 계산
function calcCart() {
  totalAmount = 0
  itemCnt = 0

  function getDiscountFromProductOverBuy10(q, curItem) {
    if (q >= 10) {
      if (curItem.id === "p1") return 0.1
      else if (curItem.id === "p2") return 0.15
      else if (curItem.id === "p3") return 0.2
      else if (curItem.id === "p4") return 0.05
      else if (curItem.id === "p5") return 0.25
    }
    return 0
  }

  // @TODO: subTot
  let subTot = 0
  Array.from(cartDisp.children).forEach((item) => {
    const curItem = productList.find((product) => product.id === item.id)
    const q = parseInt(item.querySelector("span").textContent.split("x ")[1])
    const itemTot = curItem.val * q

    itemCnt += q
    subTot += itemTot

    // 10개 이상 구매 시 상품별 10% 할인
    const disc = q >= 10 ? curItem.discount : 0
    totalAmount += itemTot * (1 - disc)
  })

  // @TODO: discRate, totalAmount
  let discRate = 0
  if (itemCnt >= 30) {
    const bulkDisc = totalAmount * 0.25
    const itemDisc = subTot - totalAmount
    if (bulkDisc > itemDisc) {
      totalAmount = subTot * (1 - 0.25)
      discRate = 0.25
    } else {
      discRate = (subTot - totalAmount) / subTot
    }
  } else {
    discRate = (subTot - totalAmount) / subTot
  }

  if (new Date().getDay() === 화요일) {
    totalAmount *= 1 - 0.1
    discRate = Math.max(discRate, 0.1)
  }

  renderTotalAmount(discRate)
  renderStockInfo()
  renderBonusPts()
}

function renderSelOpts(productList) {
  sel.innerHTML = ""

  productList.forEach((item) => {
    const opt = document.createElement("option")
    opt.value = item.id
    opt.textContent = `${item.name} - ${item.val}원`
    opt.disabled = item.q === 0
    sel.appendChild(opt)
  })
}

function renderTotalAmount(discRate) {
  sum.textContent = `총액: ${Math.round(totalAmount)}원`

  if (discRate > 0) {
    const span = document.createElement("span")
    span.className = "text-green-500 ml-2"
    span.textContent = `(${(discRate * 100).toFixed(1)}% 할인 적용)`
    sum.appendChild(span)
  }
}

// 장바구니 재고 계산
function renderStockInfo() {
  const infoMsg = productList
    .map((item) => {
      if (item.q < 5) {
        return `${item.name}: ${item.q > 0 ? `재고 부족 (${item.q}개 남음)` : "품절"}`
      }
    })
    .join("")

  stockInfo.textContent = infoMsg
}

// 장바구니 포인트 계산
function renderBonusPts() {
  const bonusPoint = Math.floor(totalAmount / 1000)

  let ptsTag = document.getElementById("loyalty-points")
  if (!ptsTag) {
    ptsTag = document.createElement("span")
    ptsTag.id = "loyalty-points"
    ptsTag.className = "text-blue-500 ml-2"
    sum.appendChild(ptsTag)
  }
  ptsTag.textContent = `(포인트: ${bonusPoint})`
}

// 메인
main()

// 행동 - 장바구니에 상품 추가
addBtn.addEventListener("click", () => {
  const selItem = sel.value

  const itemToAdd = productList.find((p) => p.id === selItem)

  if (itemToAdd && itemToAdd.q > 0) {
    const item = document.getElementById(itemToAdd.id)
    if (item) {
      const newQty = parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1
      if (newQty <= itemToAdd.q) {
        item.querySelector("span").textContent = `${itemToAdd.name} - ${itemToAdd.val}원 x ${newQty}`
        itemToAdd.q--
      } else {
        alert("재고가 부족합니다.")
      }
    } else {
      const newItem = document.createElement("div")
      newItem.id = itemToAdd.id
      newItem.className = "flex justify-between items-center mb-2"
      newItem.innerHTML = `
<span>${itemToAdd.name} - ${itemToAdd.val}원 x 1</span>
<div>
  <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
  <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
  <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
</div>`
      cartDisp.appendChild(newItem)
      itemToAdd.q--
    }

    calcCart()
    lastSel = selItem
  }
})

// 행동 - 장바구니 수량 변경
cartDisp.addEventListener("click", (event) => {
  const target = event.target

  if (target.classList.contains("quantity-change") || target.classList.contains("remove-item")) {
    const productId = target.dataset.productId
    const productElement = document.getElementById(productId)
    const product = productList.find((p) => p.id === productId)

    // 수량 변경
    if (target.classList.contains("quantity-change")) {
      const qtyChange = parseInt(target.dataset.change)
      const newQty = parseInt(productElement.querySelector("span").textContent.split("x ")[1]) + qtyChange

      if (
        newQty > 0 &&
        newQty <= product.q + parseInt(productElement.querySelector("span").textContent.split("x ")[1])
      ) {
        productElement.querySelector("span").textContent =
          `${productElement.querySelector("span").textContent.split("x ")[0]}x ${newQty}`
        product.q -= qtyChange
      } else if (newQty <= 0) {
        productElement.remove()
        product.q -= qtyChange
      } else {
        alert("재고가 부족합니다.")
      }
    }

    // 상품 제거
    else if (target.classList.contains("remove-item")) {
      const remQty = parseInt(productElement.querySelector("span").textContent.split("x ")[1])
      product.q += remQty
      productElement.remove()
    }

    calcCart()
  }
})
