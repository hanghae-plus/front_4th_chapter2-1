import { updateCartSummary, setTotalAmount } from "../models/calculateLogic"
import { productList } from "../models/userData"

// 동적
let lastSelected = null
let bonusPts = 0

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
    ProductSelect(),
    AddButton(), 
    StockInfo(), 
    CartDisplay(), 
    CartTotal()
  );
  container.appendChild(wrap);

  return container;
};

// addBtn 이벤트 리스너 등록
const handleAddtoCart = () => {
  const $select = document.getElementById('product-select');
  const selectItem = $select.value;
  const itemToAdd = productList.find((p) => p.id === selectItem);

  if (!itemToAdd || itemToAdd.q <= 0) {
    alert('재고가 부족합니다. case1');
    return;
  }

  const existingItem = document.getElementById(itemToAdd.id);
  if (existingItem) {
    const qtySpan = existingItem.querySelector('span');
    const newQty = parseInt(qtySpan.textContent.split('x ')[1], 10) + 1;
    if (newQty <= itemToAdd.q) {
      qtySpan.textContent = `${itemToAdd.name} - ${itemToAdd.val}원 x ${newQty}`;
      itemToAdd.q--;
    } else {
      alert('재고가 부족합니다.');
    }
  } else {
    const newItem = document.createElement('div');
    newItem.id = itemToAdd.id;
    newItem.className = 'flex justify-between items-center mb-2';
    newItem.innerHTML = `
      <span>${itemToAdd.name} - ${itemToAdd.val}원 x 1</span>
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
    itemToAdd.q--;
  }

  cartCalculator();
  lastSelected=selectItem;
}

const handleCartControll = (cartItems) => {
  cartItems.addEventListener('click', function (event) {
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
      $item && updateQuantity($item, product, qtyChange);
    } else if (tgt.classList.contains('remove-item')) {
      $item && removeItem($item, product);
    }
  
    cartCalculator(); // 장바구니 총합 계산
  });

  // 아이템 삭제 함수
  const removeItem = ($item, prod) => {
    const currentQty = parseInt($item.querySelector('span').textContent.split('x ')[1]);
    prod.q += currentQty;
    $item.remove();
  }

   // 재고 업데이트 함수
  const updateQuantity = ($item, prod, qtyChange) => {
    const currentQty = parseInt($item.querySelector('span').textContent.split('x ')[1]);
    const newQty = currentQty + qtyChange;
  
    if (newQty <= 0) {
      $item.remove();
      prod.q += currentQty;
    } else if (newQty <= prod.q + currentQty) {
      $item.querySelector('span').textContent = `${prod.name} - ${prod.val}원 x ${newQty}`;
      prod.q -= qtyChange;
    } else {
      alert('재고가 부족합니다.');
    }
  }  
}

const render = (component) => {
  const root = document.getElementById('app');
  root.innerHTML = '';
  root.appendChild(component());
  carculateLogic();
};

const carculateLogic = () => {
  updateSelectOptions();
  cartCalculator();

  // 랜덤한 시간마다(시간이 지나면(시간마다?)) 3초동안 세일을 알림
  setTimeout(() => {
    setInterval(() => {
      let luckyItem=productList[Math.floor(Math.random() * productList.length)];
      if(Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        updateSelectOptions();
      }
      // 다만 setTimeout 과 setInterval 을 동시에 사용하는 것은 과잉 구현에 속함
      // 하지만 논쟁의 대상으로 UX 를 조정하기 위해, 첫 랜더링 시간만 조정한 것 일수도 있다
      // setTimeout 으로 첫 이벤트 페이지만 setTimeout 으로 조정되며 그 후에는 setInterval 로 사용자에게 보여지는 것이다
    }, 30000);
    // 더 빠르게 사용자에게 노출이 되는 UX 차이가 있기 때문에 아래 로직과 중복 로직으로 제거 대상이 되지는 않음
  }, Math.random() * 10000); 

  // // 랜덤한 시간마다(시간이 지나면(시간마다?)) 6초동안 세일을 알린다
  setTimeout(() => {
    setInterval(() => {
      if(lastSelected) {
        let suggest = productList.find(item => { return item.id !== lastSelected && item.q > 0; });
        if(suggest) {
          alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          suggest.val = Math.round(suggest.val * 0.95);
          updateSelectOptions();
        }
      }
    }, 60000);
    // 위와 반대되는 사유
  }, Math.random() * 20000);
}

// select 노드의 옵션을 업데이트하는 함수
const updateSelectOptions = () => {
  const $select = document.getElementById('product-select')
  $select.innerHTML = '';
  productList.forEach(item => {
    let opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = `${item.name} - ${item.val}원`;
    if(item.q === 0) opt.disabled = true;
    $select && $select.appendChild(opt);
  });
}

// 장바구니를 계산하는 함수
const cartCalculator = () => {
  updateCartSummary();
  updateStockInfo();
  updateBonusPts();
}

// 보너스 혜택 표시 함수
const updateBonusPts=() => {
  let loyalPoint = document.getElementById('loyalty-points');
  bonusPts = Math.floor(setTotalAmount / 1000);

  if(!loyalPoint) {
    loyalPoint = document.createElement('span');
    loyalPoint.id = 'loyalty-points';
    loyalPoint.className = 'text-blue-500 ml-2';
    const $sum = document.getElementById('cart-total');
    $sum && $sum.appendChild(loyalPoint);
  }
  loyalPoint.textContent = `(포인트: ${bonusPts})`;
};

// 품절 상품 (재고부족 상품) 표시 함수
function updateStockInfo() {
  const stockInfo = document.getElementById('stock-status');
  let infoMsg = 
    productList.filter(item => item.q < 5)
      .map(item => `${item.name}: ${item.q > 0 ? '재고 부족 (' + item.q + '개 남음)' : '품절'}`)
      .join('\n');

  if (stockInfo) stockInfo.textContent = infoMsg;
}

render(App); // 랜더링 담당자 : main() 에서 render() 로 함수명 변경