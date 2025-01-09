import React, { useState, useEffect } from 'react';
import { DISCOUNTS, BULK_DISCOUNT, SPETIAL_DISCOUNT } from './constants/cart';
import { WEEKDAY } from './constants/common';

interface ProductItemType {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const App: React.FC = () => {
  // 상태 초기화
  const [state, setState] = useState<{
    productList: ProductItemType[];
    lastSelectedProduct: string | null;
    totalAmount: number;
    itemCount: number;
  }>({
    productList: [
      { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
      { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
      { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
      { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
      { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
    ],
    lastSelectedProduct: null,
    totalAmount: 0,
    itemCount: 0,
  });

  const [cartItems, setCartItems] = useState<any[]>([]); // 장바구니 아이템 상태
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null); // 선택된 상품 ID 상태

  // 장바구니 업데이트 후 총액 계산
  useEffect(() => {
    calculateCart();
  }, [cartItems]);

  // 상품 목록이 변경될 때마다 세일 이벤트 실행
  useEffect(() => {
    offerLuckySale();
    offerSuggestedProduct();
  }, [state.productList]);

  // 카트의 소계 계산 함수
  const calculateSubTotal = (cartItems: any[]) => {
    return cartItems.reduce((subTotal, item) => {
      const currentItem = state.productList.find((p) => p.id === item.id);
      if (!currentItem) {
        console.warn(`Item not found for cart item: ${item.id}`);
        return subTotal;
      }
      return subTotal + currentItem.price * item.quantity;
    }, 0);
  };

  // 대량 구매 할인 적용 함수
  const applyBulkDiscount = (subTotal: number, itemCount: number) => {
    if (itemCount >= BULK_DISCOUNT.THRESHOLD) {
      return BULK_DISCOUNT.RATE;
    }
    return 0;
  };

  // 평일 할인 적용 함수
  const applyWeekdayDiscount = (discountRate: number) => {
    if (new Date().getDay() === WEEKDAY.TUESDAY) {
      return Math.max(discountRate, DISCOUNTS.RATE_10);
    }
    return discountRate;
  };

  // 상품별 할인 적용 함수
  const applyProductDiscounts = (subTotal: number) => {
    return cartItems.reduce((discount, item) => {
      const product = state.productList.find((p) => p.id === item.id);
      if (product) {
        if (item.quantity >= 10) {
          if (product.name === '상품1') {
            return discount + DISCOUNTS.RATE_10;
          } else if (product.name === '상품2') {
            return discount + DISCOUNTS.RATE_15;
          } else if (product.name === '상품3') {
            return discount + DISCOUNTS.RATE_20;
          }
        }
      }
      return discount;
    }, 0);
  };

  // 장바구니 총액과 아이템 수 계산 함수
  const calculateCart = () => {
    const subTotal = calculateSubTotal(cartItems); // 카트 아이템의 소계 계산
    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0); // 장바구니 아이템 수 계산

    let discountRate = applyBulkDiscount(subTotal, itemCount); // 대량 구매 할인 적용
    discountRate = applyWeekdayDiscount(discountRate); // 평일 할인 적용
    discountRate = applyProductDiscounts(subTotal); // 상품별 할인 적용

    const totalAmount = subTotal * (1 - discountRate); // 최종 총액 계산

    // 상태 업데이트
    setState((prevState) => ({
      ...prevState,
      totalAmount,
      itemCount,
    }));
  };

  // 장바구니에 상품 추가 함수
  const handleAddToCart = () => {
    if (selectedProductId) {
      const selectedProduct = state.productList.find((product) => product.id === selectedProductId);
      if (selectedProduct) {
        if (selectedProduct.quantity > 0) {
          addNewItemToCart(selectedProduct);
          setState((prevState) => ({
            ...prevState,
            lastSelectedProduct: selectedProductId,
          }));
        } else {
          alert('재고가 부족합니다.');
        }
      }
    }
  };

  // 새 상품을 장바구니에 추가하는 함수
  const addNewItemToCart = (itemToAdd: ProductItemType) => {
    setCartItems([...cartItems, { ...itemToAdd, quantity: 1 }]);
    setState((prevState) => ({
      ...prevState,
      productList: prevState.productList.map((item) =>
        item.id === itemToAdd.id ? { ...item, quantity: item.quantity - 1 } : item,
      ),
    }));
  };

  // 장바구니 상품 수량 변경 함수
  const handleQuantityChange = (itemId: string, change: number) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  // 장바구니에서 상품 삭제 함수
  const handleRemoveItem = (itemId: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
  };

  // 상품 선택 옵션 업데이트 함수
  const updateProductSelectOptions = () => {
    return state.productList.map((item) => (
      <option key={item.id} value={item.id} disabled={item.quantity === 0}>
        {item.name} - {item.price}원
      </option>
    ));
  };

  // 번개세일 이벤트
  const offerLuckySale = () => {
    const luckyItem = state.productList[Math.floor(Math.random() * state.productList.length)];

    if (Math.random() < 0.3 && luckyItem.quantity > 0) {
      luckyItem.price = Math.round(luckyItem.price * SPETIAL_DISCOUNT.LUCKY);
      alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
      updateProductSelectOptions();
    }

    // 랜덤 시간 (0초 ~ 20초 사이) 후 번개세일 이벤트 실행
    setTimeout(offerLuckySale, Math.random() * 20000);
  };

  // 추천 상품 이벤트
  const offerSuggestedProduct = () => {
    if (state.lastSelectedProduct) {
      const suggestedItem = state.productList.find(function (item) {
        return item.id !== state.lastSelectedProduct && item.quantity > 0;
      });

      if (suggestedItem) {
        alert(`${suggestedItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
        suggestedItem.price = Math.round(suggestedItem.price * SPETIAL_DISCOUNT.SUGGESTED);
        updateProductSelectOptions();
      }
    }

    // 랜덤 시간 (0초 ~ 30초 사이) 후 추천 상품 이벤트 실행
    setTimeout(offerSuggestedProduct, Math.random() * 30000);
  };

  return (
    <div className='bg-gray-100 p-8'>
      <div className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'>
        <h1 className='text-2xl font-bold mb-4'>장바구니</h1>
        <div id='cart-items'>
          {/* 장바구니 아이템 리스트 출력 */}
          {cartItems.map((item) => (
            <div key={item.id} className='flex justify-between items-center mb-2'>
              <span>
                {item.name} - {item.price}원 x {item.quantity}
              </span>
              <div>
                <button
                  className='quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'
                  onClick={() => handleQuantityChange(item.id, -1)}
                >
                  -
                </button>
                <button
                  className='quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'
                  onClick={() => handleQuantityChange(item.id, 1)}
                >
                  +
                </button>
                <button
                  className='remove-item bg-red-500 text-white px-2 py-1 rounded'
                  onClick={() => handleRemoveItem(item.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
        <div id='cart-total' className='text-xl font-bold my-4'>
          총액: {Math.round(state.totalAmount)}원
        </div>
        <select
          id='product-select'
          className='border rounded p-2 mr-2'
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          {/* 상품 선택 옵션 업데이트 */}
          {updateProductSelectOptions()}
        </select>
        <button
          id='add-to-cart'
          className='bg-blue-500 text-white px-4 py-2 rounded'
          onClick={handleAddToCart}
        >
          추가
        </button>
        <div id='stock-status' className='text-sm text-gray-500 mt-2'></div>
      </div>
    </div>
  );
};

export default App;
