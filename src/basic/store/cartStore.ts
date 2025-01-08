import { createStore } from '../utils/createStore';

export interface Product {
  id: string;
  name: string;
  val: number;
  q: number;
}

interface CartState {
  cartList: Product[];
  totalPrice: number;
}

interface CartActions {
  getCartList: () => Product[];
  getCartItem: (id: string) => Product | undefined;
  addCartItem: (item: Product) => void;
  getTotalAmount: () => number;
  removeCartItem: (id: string) => void;
}

export const CartStore = createStore<CartState, CartActions>(
  {
    cartList: [],
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
function calcCart(cartList: CartState['cartList']) {
  // 임시 변수
  // let sum;

  // 토탈 가격
  let totalAmt = 0;
  // 아이템 개수 itemCount
  const itemCnt = 0;

  // 뭔지 모르겠음 Total
  const subTot = 0;

  const { totalQuantity, totalAmount, totalDiscountedAmount } = getCartItemsInfo(cartList);

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

function getCartItemsInfo(cartList: Product[]) {
  let totalQuantity = 0;
  let totalAmount = 0;
  let totalDiscountedAmount = 0;

  const sumQuantity = createSum();
  const sumAmount = createSum();
  const sumDiscountedAmount = createSum();

  for (const cartItem of cartList) {
    const { val, q } = cartItem;

    // 현재 아이템으로 선택된 아이템의 재고 총액
    const cartItemTotalAmount = val * q;

    // 매칭된 아이템의 할인율
    const discountRate = calculateFinalDiscountRate(q, cartItem.id as ProductId);

    // 재고의 합
    totalQuantity = sumQuantity(cartItem.q);

    // 현재 아이템의 총액을 subTotal에 더한다.
    totalAmount = sumAmount(cartItemTotalAmount);

    // 총액에 현재 아이템의 총액에 할인율을 계산한 값을 할당
    totalDiscountedAmount = sumDiscountedAmount(cartItemTotalAmount * (1 - discountRate));
  }

  return {
    totalQuantity,
    totalAmount,
    totalDiscountedAmount,
  };
}

type ProductId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5';
type DiscountRates = Record<ProductId, number>;

const PRODUCT_DISCOUNT_RATES: DiscountRates = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
} as const;

const QUANTITY_THRESHOLD = 10;

function getProductBaseDiscountRate(productId: ProductId): number {
  return PRODUCT_DISCOUNT_RATES[productId] ?? 0;
}

function isOverDiscountQuantity(quantity: number): boolean {
  return quantity >= QUANTITY_THRESHOLD;
}

function calculateFinalDiscountRate(quantity: number, id: ProductId) {
  const baseDiscountRate = getProductBaseDiscountRate(id);
  return isOverDiscountQuantity(quantity) ? baseDiscountRate : 0;
}

function createSum() {
  let sum = 0;

  return (value: number) => {
    return (sum += value);
  };
}
