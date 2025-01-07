import { createStore } from '../utils/createStore';

export interface Product {
  id: string;
  name: string;
  val: number;
  q: number;
}

interface CartState {
  cartList: Product[] | null;
  totalPrice: number;
}

interface CartActions {
  getCartList: () => Product[] | null;
  getCartItem: (id: string) => Product | undefined;
  addCartItem: (item: Product) => void;
  getTotalAmount: () => number;
  removeCartItem: (id: string) => void;
}

export const CartStore = createStore<CartState, CartActions>(
  {
    cartList: null,
    totalPrice: 0,
  },
  (state, notify) => ({
    getCartList: () => {
      return state.cartList;
    },
    getCartItem: (id: string) => {
      return state.cartList?.find((item) => item.id === id);
    },
    getTotalAmount: () => {
      if (!state.cartList) return 0;

      return state.cartList.reduce((prev, curr) => prev + curr.val, 0);
    },
    addCartItem: (item: Product) => {
      if (state.cartList) {
        const existingItem = state.cartList.find((cartItem) => cartItem.id === item.id);
        if (existingItem) {
          existingItem.q += 1;
        } else {
          state.cartList.push({ ...item, q: 1 });
        }
      } else {
        state.cartList = [item];
      }

      state.totalPrice = (state.cartList || []).reduce((sum, item) => sum + item.val * item.q, 0);
      notify();
    },
    removeCartItem: (id: string) => {
      if (!state.cartList) return;
      state.cartList = state.cartList.filter((item) => item.id !== id);
      state.totalPrice = state.cartList.reduce((sum, item) => sum + item.val * item.q, 0);
      notify();
    },
  }),
);

// INFO: 카트 계산 로직 함수
function calcCart() {
  // 임시 변수
  // let sum;

  // 토탈 가격
  totalAmt = 0;
  // 아이템 개수 itemCount
  itemCnt = 0;

  // 아이템 객체 (스토어에서 처리하기 때문에 children으로 빼오지 않아도 된다 state에서 빼오면 됨)
  const cartItems = cartDisp.children;

  // 뭔지 모르겠음 Total
  let subTot = 0;

  // cartCount만큼 반복문
  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;

      // 타입 에러 처리를 위한 임시 유효성
      if (!curItem) return;

      // 카운트 내부에서 프로덕트 리스트 갯수만큼 반복
      for (let j = 0; j < prodList.length; j++) {
        // 현재 프로덕트 아이템과 카트 아이템이 같다면
        if (prodList[j].id === cartItems[i].id) {
          // 프로덕트 아이템을 currentItem에 할당
          curItem = prodList[j];
          break;
        }
      }

      // 재고 (cartStore 내부에서 현재 아이템의 q를 뽑아오면 된다)
      const q = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);

      // 현재 아이템으로 선택된 녀석들의 총액
      const itemTot = curItem.val * q;

      // disc가 뭔지 모르겠지만 변수
      let disc = 0;

      // 재고를 itemCount에 더한다
      itemCnt += q;

      // 현재 아이템의 총액을 subTotal에 더한다.
      subTot += itemTot;

      // 아이템 갯수별 할인 적용률을 처리하는 로직
      if (q >= 10) {
        if (curItem.id === 'p1') disc = 0.1;
        else if (curItem.id === 'p2') disc = 0.15;
        else if (curItem.id === 'p3') disc = 0.2;
        else if (curItem.id === 'p4') disc = 0.05;
        else if (curItem.id === 'p5') disc = 0.25;
      }

      // 총액에 현재 아이템의 총액에 할인율을 계산한 값을 할당
      totalAmt += itemTot * (1 - disc);

      // 반복문 마지막 줄
    })();
  }

  // 할인율 같음
  let discRate = 0;

  // itemCount가 30이 넘으면 할인 로직을 따로 처리하는 듯
  if (itemCnt >= 30) {
    // itemCount가 30이 넘으면 총액의 0.25를 곱해 할당
    const bulkDisc = totalAmt * 0.25;

    // 현재 아이템들의 총액에 카트 총액을 빼서 할당
    const itemDisc = subTot - totalAmt;

    // itemDisc보다 총액의 0.25를 곱한 값이 더 크면
    if (bulkDisc > itemDisc) {
      // 총액에 현재 아이템에서 0.75를 곱해 총액에 할당
      totalAmt = subTot * (1 - 0.25);
      // 할인율 할당
      discRate = 0.25;
    } else {
      // itemDisc보다 총액의 0.25를 곱한 값이 더 크지 않으면
      // 할인율에 현재 아이템의 총액에서 카트의 총액을 빼고 해당 값을 현재 아이템의 총액만큼 나누어서 할당
      discRate = (subTot - totalAmt) / subTot;
    }
  } else {
    // itemCount가 30이 넘지 않으면
    // 할인율에 현재 아이템의 총액에서 카트의 총액을 빼고 해당 값을 현재 아이템의 총액만큼 나누어서 할당
    discRate = (subTot - totalAmt) / subTot;
  }

  // 화요일이면! (화요일만 특수하게 할인 로직이 들어간다)
  if (new Date().getDay() === 2) {
    // 총액에 0.9를 곱한다
    totalAmt *= 1 - 0.1;
    // 할인율이 0.1보다 큰 걸 처리하는듯?
    discRate = Math.max(discRate, 0.1);
  }

  // 총액을 처리하는 엘리먼트에 string을 처리한다
  // TotalPrice 컴포넌트에서 처리
  // sum.textContent = '총액: ' + Math.round(totalAmt) + '원';

  // 할인율이 0보다 크면
  if (discRate > 0) {
    // 총액을 처리하는 엘리먼트에 클래스와 string을 입혀 넣는다.
    // TotalPrice 컴포넌트에서 처리
    // const span = document.createElement('span');
    // span.className = 'text-green-500 ml-2';
    // span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    // sum.appendChild(span);
  }
  // 재고 함수 호출
  updateStockInfo();

  // 보너스 함수 호출
  renderBonusPts();
}
