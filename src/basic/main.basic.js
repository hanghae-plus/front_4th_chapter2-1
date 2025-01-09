import { updateCartSummary, setTotalAmount } from "./models/calculateLogic"
import { productList } from "./models/userData"

// 동적
let lastSelected = null
let bonusPts = 0

// 그저 노드 창조 함수
const createElement = (tag, options = {}) => {
  const element = document.createElement(tag);
  if (options.id) element.id = options.id;
  if (options.className) element.className = options.className;
  if (options.textContent) element.textContent = options.textContent;
  return element;
};

// 컴포넌트
const Header = () => createElement('h1', { className: 'text-2xl font-bold mb-4', textContent: '장바구니' });
const StockInfo = () => createElement('div', { id: 'stock-status', className: 'text-sm text-gray-500 mt-2' });
const CartDisplay = () => createElement('div', { id: 'cart-items' });
const CartTotal = () => createElement('div', { id: 'cart-total', className: 'text-xl font-bold my-4' });
const ProductSelect = () => createElement('select', { id: 'product-select', className: 'border rounded p-2 mr-2'});
const AddButton = () => {
  const button = document.createElement('button');
  button.id = 'add-to-cart';
  button.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  button.textContent = '추가';
  button.addEventListener('click', handleAddtoCart);
  return button;
};
const App = () => {
  const container = createElement('div', { className: 'bg-gray-100 p-8' });
  const wrap = createElement('div', { className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8' });

  wrap.append(
    Header(), 
    CartDisplay(),
    CartTotal(),
    ProductSelect(), 
    AddButton(), 
    StockInfo(), 
  );
  container.appendChild(wrap);

  return container;
};

// addBtn 이벤트 리스너 등록
const handleAddtoCart = () => {
  const $select = document.getElementById('product-select');
  const selectItem = $select.value;
  const itemToAdd = productList.find((p) => p.id === selectItem);

  if (!itemToAdd || itemToAdd.stock <= 0) {
    alert('재고가 부족합니다.');
    return;
  }

  const existingItem = document.getElementById(itemToAdd.id);
  if (existingItem) {
    const qtySpan = existingItem.querySelector('span');
    const newQty = parseInt(qtySpan.textContent.split('x ')[1], 10) + 1;
    if (newQty <= itemToAdd.stock) {
      qtySpan.textContent = `${itemToAdd.name} - ${itemToAdd.price}원 x ${newQty}`;
      itemToAdd.stock--;
    } else {
      alert('재고가 부족합니다.');
    }
  } else {
    const newItem = document.createElement('div');
    newItem.id = itemToAdd.id;
    newItem.className = 'flex justify-between items-center mb-2';
    newItem.innerHTML = `
      <span>${itemToAdd.name} - ${itemToAdd.price}원 x 1</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
      </div>`;
    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
      cartItems.appendChild(newItem);
      handleCartControll(cartItems);
    }
    itemToAdd.stock--;
  }

  cartCalculator();
  lastSelected=selectItem;
}

// 장바구니 컨트롤 이벤트 리스너
const handleCartControll = (cartItems) => {
  cartItems.addEventListener('click', event => {
    const tgt = event.target;
  
    // 관련 버튼이 아니면 early return
    if (!tgt.classList.contains('quantity-change') && !tgt.classList.contains('remove-item')) {
      return; 
    }
  
    const productId = tgt.dataset.productId;
    const $item = document.getElementById(productId);
    const product = productList.find((p) => p.id === productId);
  
    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change);
      updateQuantity($item, product, qtyChange);
    } else if (tgt.classList.contains('remove-item')) {
      removeItem($item, product);
    }
  
    cartCalculator(); // 장바구니 총합 계산
  });

  // 아이템 삭제 함수
  const removeItem = ($item, prod) => {
    const currentQty = parseInt($item.querySelector('span').textContent.split('x ')[1]);
    prod.stock += currentQty;
    $item.remove();
  }

   // 재고 업데이트 함수
  const updateQuantity = ($item, prod, qtyChange) => {
    const currentQty = parseInt($item.querySelector('span').textContent.split('x ')[1]);
    const newQty = currentQty + qtyChange;
  
    if (newQty <= 0) {
      $item.remove();
      prod.stock += currentQty;
    } else if (newQty <= prod.stock + currentQty) {
      $item.querySelector('span').textContent = `${prod.name} - ${prod.price}원 x ${newQty}`;
      prod.stock -= qtyChange;
    } else {
      alert('재고가 부족합니다.');
    }
  }  
}

// 랜더링 함수
const render = (component) => {
  const root = document.getElementById('app');
  root.innerHTML = '';
  root.appendChild(component());
  carculateLogic();
};

// 로직 실행 함수
const carculateLogic = () => {
  cartCalculator();
  updateSelectOptions();

  // 콜백 구조로 랜덤 할인 알림 실행
  initRandomAlert({
    onFlashSale: luckyItem => {
      luckyItem.price = Math.round(luckyItem.price * 0.8); // 20% 할인
      alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
      updateSelectOptions();
    },
    onSuggestion: suggestItem => {
      suggestItem.price = Math.round(suggestItem.price * 0.95); // 5% 할인
      alert(`${suggestItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
      updateSelectOptions();
    }
  });  
}

// 콜백 구조로 랜덤 할인 알림 실행 : 초기화 단계
const initRandomAlert = ({ onFlashSale, onSuggestion }) => {
  setTimeout(() => {
    setInterval(() => {
      const luckyItem = getRandomItem();
      if(Math.random() < 0.3 && luckyItem) {
        onFlashSale(luckyItem)
      }
    }, 30000);
  }, Math.random() * 10000); 

  setTimeout(() => {
    setInterval(() => {
      if(lastSelected) {
        let suggestItem = productList.find(
          item => item.id !== lastSelected && item.stock > 0
        );
        
        if (suggestItem) {
          onSuggestion(suggestItem);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

// 콜백 구조로 랜덤 할인 알림 실행 : 랜덤 아이템을 Stock으로 부터 승선 시킴
const getRandomItem = () => {
  const availableItems = productList.filter(item => item.stock > 0);
  return availableItems.length > 0 
    ? availableItems[Math.floor(Math.random() * productList.length)]
    : null;
}

// select 노드의 옵션을 업데이트하는 함수
const updateSelectOptions = () => {
  const $select = document.getElementById('product-select')
  $select.innerHTML = '';
  productList.forEach(item => {
    let $option = document.createElement('option');
    $option.value = item.id;
    $option.textContent = `${item.name} - ${item.price}원`;
    if(item.stock === 0) $option.disabled = true;
    $select && $select.appendChild($option);
  });
}

// 장바구니 업데이트 할때마다 요소 업데이트 하는 함수
const cartCalculator = () => {
  updateCartSummary(); // model 단계에 존재
  updateStockInfo();
  updateBonusPts();
}

// 보너스 혜택 표시 함수
const updateBonusPts=() => {
  let $loyalPoint = document.getElementById('loyalty-points');
  bonusPts = Math.floor(setTotalAmount / 1000);

  if(!$loyalPoint) {
    $loyalPoint = document.createElement('span');
    $loyalPoint.id = 'loyalty-points';
    $loyalPoint.className = 'text-blue-500 ml-2';
    const $sum = document.getElementById('cart-total');
    $sum && $sum.appendChild($loyalPoint);
  }

  $loyalPoint.textContent = `(포인트: ${bonusPts})`;
};

// 품절 상품 (재고부족 상품) 표시 함수
function updateStockInfo() {
  const $stockInfo = document.getElementById('stock-status');
  let infoMsg = 
    productList.filter(item => item.stock < 5)
      .map(item => 
        `${item.name}: ${item.stock > 0
          ? '재고 부족 (' + item.stock + '개 남음)'
          : '품절'}`)
      .join('\n');

  $stockInfo.textContent = infoMsg;
}

render(App); // 랜더링 담당자 : main() 에서 render() 로 함수명 변경