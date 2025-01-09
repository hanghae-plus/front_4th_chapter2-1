// 주요 상수 및 초기값 설정
const DISCOUNT_DAY = 2; // 화요일
const BULK_DISCOUNT_RATE = 0.25; // 대량 구매 할인 비율
const DAY_DISCOUNT_RATE = 0.1; // 화요일 할인 비율
const BONUS_POINT_DIVISOR = 1000; // 포인트 계산 기준 (총액 / 1000)
const SALE_CHANCE = 0.3; // 번개 세일 발생 확률
const SALE_DISCOUNT = 0.2; // 번개 세일 할인 비율
const SUGGEST_DISCOUNT = 0.05; // 추천 상품 할인 비율
const LOW_STOCK_THRESHOLD = 5; // 재고 부족 기준

// 전역 변수 관리
var productList, selectedProduct, addButton, cartDisplay, totalDisplay, stockInfo;
var lastPickProduct, bonusPoints=0, totalAmount=0, totalItems=0;

/**
 * 메인 함수: 초기화 작업 수행
 * - 상품 목록 초기화
 * - UI 생성
 * - 초기 상품 옵션 설정
 * - 초기 장바구니 계산
 * - 프로모션 설정
 */
function main() {
  // 초기 상품 목록 설정
  productList=[
    {id: 'p1', name: '상품1', price: 10000, quantity: 50 },
    {id: 'p2', name: '상품2', price: 20000, quantity: 30 },
    {id: 'p3', name: '상품3', price: 30000, quantity: 20 },
    {id: 'p4', name: '상품4', price: 15000, quantity: 0 },
    {id: 'p5', name: '상품5', price: 25000, quantity: 10 }
  ];
  
  setupUI(); // UI 생성 및 이벤트 바인딩
  updatePickProduct(); // 상품 선택 옵션 업데이트
  calculateCart(); // 장바구니 초기 계산
  setupPromotions(); // 프로모션 설정
}

/**
 * 프로모션 설정 함수
 * - 번개 세일: 랜덤한 상품에 일정 확률로 할인 적용
 * - 추천 상품 세일: 이전 선택 상품 기반으로 추천 상품 할인
 */
function setupPromotions() {
  // 번개 세일 설정
  setTimeout(function () {
    setInterval(() => {
      const luckyItem = productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < SALE_CHANCE && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * (1 - SALE_DISCOUNT));
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        updatePickProduct(); // 상품 선택 옵션 업데이트
      }
    }, 30000);
  }, Math.random() * 10000);
  
  // 추천 상품 세일 설정
  setTimeout(function () {
    setInterval(() => {
      if (lastPickProduct) {
        const recommendedItem = productList.find((item) => 
          item.id !== lastPickProduct && item.quantity > 0
        );
        if (recommendedItem) {
          recommendedItem.price = Math.floor(recommendedItem.price * (1 - SUGGEST_DISCOUNT));
          alert(`${recommendedItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          updatePickProduct(); // 상품 선택 옵션 업데이트
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

/**
 * UI 설정 함수
 * - UI 요소 생성하고 DOM에 추가
 * - 버튼 및 장바구니 액션 이벤트 바인딩
 */
function setupUI() {
  const root = document.getElementById("app"); // 루트 컨테이너
  const container = document.createElement("div"); // 전체 UI 컨테이너
  const wrapper = document.createElement("div"); // 카드 UI 래퍼
  const header = document.createElement("h1"); // 제목 헤더

  // 주요 UI 생성
  cartDisplay = document.createElement("div"); // 장바구니 항목 표시 영역
  totalDisplay = document.createElement("div"); // 총액 표시 영역
  selectedProduct = document.createElement("select"); // 상품 선택 드롭다운
  addButton = document.createElement("button"); // 장바구니 추가 버튼
  stockInfo = document.createElement("div"); // 재고 상태 표시 영역

  // UI 클래스 및 스타일 설정
  container.className='bg-gray-100 p-8';
  wrapper.className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  header.className='text-2xl font-bold mb-4';
  totalDisplay.className='text-xl font-bold my-4';
  selectedProduct.className='border rounded p-2 mr-2';
  addButton.className='bg-blue-500 text-white px-4 py-2 rounded';
  stockInfo.className='text-sm text-gray-500 mt-2';

  // UI 요소 ID 설정
  cartDisplay.id='cart-items';
  totalDisplay.id='cart-total';
  selectedProduct.id='product-select';
  addButton.id='add-to-cart';
  stockInfo.id='stock-status';

  // UI 텍스트 설정
  header.textContent = "장바구니";
  addButton.textContent = "추가";
  
  // UI 요소 DOM에 추가
  wrapper.append(header, cartDisplay, totalDisplay, selectedProduct, addButton, stockInfo);
  container.appendChild(wrapper);
  root.appendChild(container);

  // 이벤트 바인딩
  addButton.addEventListener("click", addToCart); // 추가 버튼 클릭 이벤트
  cartDisplay.addEventListener("click", handleCartAction); // 장바구니 항목 이벤트
}

/**
 * 상품 선택 옵션 업데이트
 * - 상품 목록을 기반으로 드롭다운 옵션 생성
 * - 재고가 0인 상품은 선택 불가하도록 설정
 */
function updatePickProduct() {
  selectedProduct.innerHTML = ""; // 기존 옵션 제거

  productList.forEach((product) => {
    const option= document.createElement("option");
    option.value = product.id; // 상품 ID 설정
    option.textContent = `${product.name} - ${product.price}원`; // 상품명 및 가격 표시
    option.disabled = product.quantity === 0; // 재고가 0일경우 비활성화
    selectedProduct.appendChild(option); // 옵션 추가
  });
}

/**
 * 장바구니 계산 함수
 * - 총액, 총 아이템 수 계산
 * - 대량 구매 할인 및 화요일 할인 적용
 */
function calculateCart() {
  totalAmount = 0;
  totalItems = 0;

  const cartItems = Array.from(cartDisplay.children); // 장바구니 항목 가져오기
  let subTotal = 0;

  cartItems.forEach((item) => {
    const productId = item.id;
    const product = productList.find((p) => p.id === productId); // 상품 정보
    const quantity = parseInt(item.querySelector("span").textContent.split("x ")[1]); // 수량

    const itemTotal = product.price * quantity; // 항목 총액
    let discountRate = 0; // 개별 할인율

    // 대량 구매 할인 조건
    if (quantity >= 10) {
      discountRate = getQuantityDiscount(product.id);
    }

    totalItems += quantity; // 총 아이템 수 누적
    subTotal += itemTotal; // 소계 누적    
    totalAmount += itemTotal * (1 - discountRate); // 총액 계산
  });

  let dayDiscountApplied = false;
  let bulkDiscountApplied = false;

  // 대량 구매 할인 적용
  if (totalItems >= 30) {
    const bulkDiscount = subTotal * BULK_DISCOUNT_RATE;
    totalAmount -= bulkDiscount;
    bulkDiscountApplied = true;
  }

  // 화요일 할인 적용
  if (new Date().getDay() === DISCOUNT_DAY) {
    totalAmount *= (1 - DAY_DISCOUNT_RATE);
    dayDiscountApplied = true;
  }

  bonusPoints = Math.floor(totalAmount / BONUS_POINT_DIVISOR); // 포인트 계산
  displayTotal(dayDiscountApplied, bulkDiscountApplied); // 결과 표시
  updateStockInfo(); // 재고 정보 업데이트
}

/**
 * 상품별 할인율 반환
 */
function getQuantityDiscount(productId) {
  const discountRates = {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25,
  };
  return discountRates[productId] || 0; // 할인율 반환
}

/**
 * 대량 구매 할인 함수
 * - 장바구니 총 수량이 30개 이상일 때 할인 적용
 * - 총액에서 할인 금액 차감
 */
function bulkDiscount(subTotal) {
  if (totalItems >= 30) {
    const bulkDiscount = subTotal * BULK_DISCOUNT_RATE; // 대량 구매 할인 계산
    totalAmount -= bulkDiscount; // 총액에서 할인 차감
    return true; // 할인 적용
  }
  return false; // 할인 미적용
}

/**
 * 총액 및 할인 메시지 표시
 */
function displayTotal(dayDiscountApplied, bulkDiscountApplied) {
  let baseText = `총액: ${totalAmount}원`;
  let pointsDisplay = `(포인트: ${bonusPoints})`;

  totalDisplay.textContent = baseText; // 총액 표시
  
  // 포인트 표시 추가
  const pointsTag = document.createElement("span");
  pointsTag.id = "loyalty-points";
  pointsTag.className = "text-blue-500 ml-2";
  pointsTag.textContent = pointsDisplay;
  totalDisplay.appendChild(pointsTag);

  // 할인 적용 메시지  
  let discountMessage = "";
  if (dayDiscountApplied) discountMessage += "(10.0% 할인 적용)";
  if (bulkDiscountApplied) discountMessage += "(대량 구매 할인 적용)";

  if (discountMessage) {
    const discountTag = document.createElement("span");

    discountTag.className = "text-green-500 ml-2";
    discountTag.textContent = discountMessage;
    totalDisplay.appendChild(discountTag);
  }
}

function updateStockInfo() {
  const lowStockInfo = productList
    .filter((item) => item.quantity < LOW_STOCK_THRESHOLD)
    .map((item) => `${item.name}: ${item.quantity > 0 ? `재고 부족 (${item.quantity}개 남음)` : "품절"}`)
    .join("\n"); // 배열을 문자열로 변환할 때 각 요소를 줄바꿈 문자로 연결

  stockInfo.textContent = lowStockInfo;
}

/**
 * 장바구니에 상품 추가
 */
function addToCart() {
  const selectedId = selectedProduct.value; // 선택된 상품 ID
  const product = productList.find((p) => p.id === selectedId);

  if (product && product.quantity > 0) {
    let cartItem = document.getElementById(product.id);

    // 기존 항목 증가
    if (cartItem) {
      const quantity = parseInt(cartItem.querySelector("span").textContent.split("x ")[1]) + 1;
      if (quantity <= product.quantity) {
        cartItem.querySelector("span").textContent = `${product.name} - ${product.price}원 x ${quantity}`;
        product.quantity--;
      } else {
        alert("재고가 부족합니다."); // 재고 부족 알림
      }
    } else {
      // 새 항목 추가
      cartItem = createCartItem(product);
      cartDisplay.appendChild(cartItem);
      product.quantity--;
    }

    calculateCart(); // 장바구니 계산 업데이트
    lastPickProduct = selectedId; // 마지막 선택 상품 저장
  }
}

/**
 * 장바구니 항목 생성
 */
function createCartItem(product) {
  const item = document.createElement("div");
  item.id = product.id;
  item.className = "flex justify-between items-center mb-2";
  item.innerHTML = 
    `
    <span>${product.name} - ${product.price}원 x 1</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
    </div>
    `
  return item;
}

/**
 * 장바구니 액션 처리 (수량 변경, 삭제) 
 */
function handleCartAction(e) {
  const target = e.target;
  const productId = target.dataset.productId;
  const product = productList.find((p) => p.id === productId);

  if (target.classList.contains("quantity-change")) {
    const change = parseInt(target.dataset.change);
    const cartItem = document.getElementById(productId);
    const currentQuantity = parseInt(cartItem.querySelector("span").textContent.split("x ")[1]);
    const newQuantity = currentQuantity + change;

    if (newQuantity > 0 && newQuantity <= product.quantity + currentQuantity) {
      cartItem.querySelector("span").textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
      product.quantity -= change;
    } else if (newQuantity <= 0) {
      cartItem.remove();
      product.quantity += currentQuantity;
    } else {
      alert("재고가 부족합니다.");
    }
  } else if (target.classList.contains("remove-item")) {
    const cartItem = document.getElementById(productId);
    const currentQuantity = parseInt(cartItem.querySelector("span").textContent.split("x ")[1]);

    product.quantity += currentQuantity;
    cartItem.remove();
  }

  calculateCart(); // 장바구니 업데이트
}

main();