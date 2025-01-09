import React from "react";
import Header from "./components/Header";
import StockInfo from "./components/StockInfo";
import CartDisplay from "./components/CartDisplay";
import CartTotal from "./components/CartTotal";
import ProductSelect from "./components/ProductSelect";
import AddButton from "./components/AddButton";

// import { updateCartSummary, setTotalAmount } from "../models/calculateLogic"
// import { productList } from "../models/userData"

const App: React.FC = () => {
    // 동적
    // let lastSelected = null
    // let bonusPts = 0
    
    // // 로직 실행 함수
    // const carculateLogic = () => {
    //     cartCalculator();
    //     updateSelectOptions();
    
    //     // 콜백 구조로 랜덤 할인 알림 실행
    //     initRandomAlert({
    //     onFlashSale: luckyItem => {
    //         luckyItem.val = Math.round(luckyItem.val * 0.8); // 20% 할인
    //         alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
    //         updateSelectOptions();
    //     },
    //     onSuggestion: suggestItem => {
    //         suggestItem.val = Math.round(suggestItem.val * 0.95); // 5% 할인
    //         alert(`${suggestItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
    //         updateSelectOptions();
    //     }
    //     });  
    // }
    
    // // 콜백 구조로 랜덤 할인 알림 실행 : 초기화 단계
    // const initRandomAlert = ({ onFlashSale, onSuggestion }) => {
    //     setTimeout(() => {
    //     setInterval(() => {
    //         const luckyItem = getRandomItem();
    //         if(Math.random() < 0.3 && luckyItem) {
    //         onFlashSale(luckyItem)
    //         }
    //     }, 30000);
    //     }, Math.random() * 10000); 
    
    //     setTimeout(() => {
    //     setInterval(() => {
    //         if(lastSelected) {
    //         let suggestItem = productList.find(
    //             item => item.id !== lastSelected && item.q > 0
    //         );
            
    //         if (suggestItem) {
    //             onSuggestion(suggestItem);
    //         }
    //         }
    //     }, 60000);
    //     }, Math.random() * 20000);
    // }
    
    // // 콜백 구조로 랜덤 할인 알림 실행 : 랜덤 아이템을 Stock으로 부터 승선 시킴
    // const getRandomItem = () => {
    //     const availableItems = productList.filter(item => item.q > 0);
    //     return availableItems.length > 0 
    //     ? availableItems[Math.floor(Math.random() * productList.length)]
    //     : null;
    // }
    
    // // select 노드의 옵션을 업데이트하는 함수
    // const updateSelectOptions = () => {
    //     const $select = document.getElementById('product-select')
    //     $select.innerHTML = '';
    //     productList.forEach(item => {
    //     let $option = document.createElement('option');
    //     $option.value = item.id;
    //     $option.textContent = `${item.name} - ${item.val}원`;
    //     if(item.q === 0) $option.disabled = true;
    //     $select && $select.appendChild($option);
    //     });
    // }
    
    // // 장바구니 업데이트 할때마다 요소 업데이트 하는 함수
    // const cartCalculator = () => {
    //     updateCartSummary(); // model 단계에 존재
    //     updateStockInfo();
    //     updateBonusPts();
    // }
    
    // // 보너스 혜택 표시 함수
    // const updateBonusPts=() => {
    //     let $loyalPoint = document.getElementById('loyalty-points');
    //     bonusPts = Math.floor(setTotalAmount / 1000);
    
    //     if(!$loyalPoint) {
    //     $loyalPoint = document.createElement('span');
    //     $loyalPoint.id = 'loyalty-points';
    //     $loyalPoint.className = 'text-blue-500 ml-2';
    //     const $sum = document.getElementById('cart-total');
    //     $sum && $sum.appendChild($loyalPoint);
    //     }
    
    //     $loyalPoint.textContent = `(포인트: ${bonusPts})`;
    // };
    
    // // 품절 상품 (재고부족 상품) 표시 함수
    // function updateStockInfo() {
    //     const $stockInfo = document.getElementById('stock-status');
    //     let infoMsg = 
    //     productList.filter(item => item.q < 5)
    //         .map(item => 
    //         `${item.name}: ${item.q > 0
    //             ? '재고 부족 (' + item.q + '개 남음)'
    //             : '품절'}`)
    //         .join('\n');
    
    //     $stockInfo.textContent = infoMsg;
    // }

    return (
        <div className="bg-gray-100 p-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
                <Header />
                <StockInfo />
                <CartDisplay />
                <CartTotal />
                <ProductSelect />
                {/* <AddButton /> */}
            </div>
        </div>
    );
};

export default App;