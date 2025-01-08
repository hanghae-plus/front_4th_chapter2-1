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
  { id: 'p1', name: '상품1', value: 10000, stock: 50 },
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
