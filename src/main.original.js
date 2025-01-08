/**
 * 메인 함수
 */
function main() {
  return `
      <div class="bg-gray-100 p-8"> 
        <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
          <h1 class="text-2xl font-bold mb-4">장바구니</h1>
          <div id="cart-items">
            
          </div>
          <div id="cart-total" class="text-xl font-bold my-4">
            총액: 0원
            <span id="loyalty-points" class="text-blue-500 ml-2">
              (포인트: 0)
            </span>
          </div>
          <select id="product-select" class="border rounded p-2 mr-2"></select>
          <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">
            추가
          </button>
          <div id="stock-status" class="text-sm text-gray-500 mt-2">
            상품4: 품절
          </div>
        </div>
      </div>`
}

// 상품 목록
const productList = [
  { id: 'p1', name: '상품1', value: 10000, stock: 10 },
  { id: 'p2', name: '상품2', value: 20000, stock: 30 },
  { id: 'p3', name: '상품3', value: 30000, stock: 20 },
  { id: 'p4', name: '상품4', value: 15000, stock: 0 },
  { id: 'p5', name: '상품5', value: 25000, stock: 10 },
]

/**
 * 상품 목록을 업데이트하는 함수
 */
function updateSelectOptions() {
  // select 요소
  const $productSelect = document.getElementById('product-select')

  // productList를 순회하며 상품 목록 select요소에 추가
  productList.forEach((product) => {
    const option = document.createElement('option')
    option.value = product.id
    option.textContent = `${product.name} - ${product.value}원`
    if (product.stock === 0) option.disabled = true
    $productSelect.appendChild(option)
  })
}

/**
 * 장바구니 추가 이벤트 핸들러
 */
function handleAddToCart() {
  // 상품 선택 select 요소
  const $productSelect = document.getElementById('product-select')

  // 선택한 상품 정보
  const selectedProduct = [...productList].find(
    (product) => product.id === $productSelect.value,
  )

  // 현재 장바구니에 담긴 수량 확인
  const cartItem = document.getElementById(selectedProduct.id)
  const currentQuantity = cartItem
    ? parseInt(cartItem.querySelector('span').textContent.split('x ')[1])
    : 0

  // 사용 가능한 총 수량 체크 (현재 재고 + 장바구니 수량)
  const availableQuantity = selectedProduct?.stock + currentQuantity

  if (selectedProduct && availableQuantity > 0) {
    const cartItem = document.getElementById(selectedProduct.id)

    if (cartItem) {
      // 현재 선택 상품 수량 + 1
      const [_, quantity] = cartItem
        .querySelector('span')
        .textContent.split('x ')
      const currentQuantity = parseInt(quantity)
      const newQuantity = currentQuantity + 1

      // 상품 수량이 재고보다 작거나 같은 경우 수량 업데이트
      if (newQuantity <= selectedProduct.stock + currentQuantity) {
        cartItem.querySelector('span').textContent =
          `${selectedProduct.name} - ${selectedProduct.value}원 x ${newQuantity}`
        selectedProduct.stock--
      } else {
        // 재고가 부족한 경우 알림
        alert('재고가 부족합니다.')
      }
    } else {
      // 장바구니에 상품이 없는 경우 새로운 장바구니 아이템 생성
      const newItem = document.createElement('div')
      const cartItems = document.getElementById('cart-items')
      newItem.id = selectedProduct.id
      newItem.className = 'flex justify-between items-center mb-2'
      newItem.innerHTML = `
        <span>
          ${selectedProduct.name} - ${selectedProduct.value}원 x 1
        </span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${selectedProduct.id}" data-change="-1">
            -
          </button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${selectedProduct.id}" data-change="1">
            +
          </button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${selectedProduct.id}">
            삭제
          </button>
        </div>`
      cartItems.appendChild(newItem)
      selectedProduct.stock -= 1
    }
  }
}

/**
 * 이벤트 관리 함수
 */
function EventManager() {
  const $addToCart = document.getElementById('add-to-cart')

  $addToCart.addEventListener('click', handleAddToCart)
}

/**
 * 초기화 함수
 */
function init() {
  const $root = document.getElementById('app')
  $root.innerHTML = main()
  updateSelectOptions()
  EventManager()
}

init()
