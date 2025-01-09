import React, { useEffect, useState } from "react";

import Cart from "./Cart";

import { updateCartSummary, sumAmount } from "../model/calculateLogic"
import { productList, Product } from "../model/datas"

// 콜백함수 타입 정의
type FlashSaleCallback = (luckyItem: Product) => void;
type SuggestionCallback = (suggestItem: Product) => void;

const App: React.FC = () => {
    const [lastSelected, setLastSelected] = useState<string | null>("");
    let bonusPoints: number | null = 0;

    // App.tsx 에서는 장바구니 첫 랜더링 및 주기적 업데이트를 책임진다 
    // 그래서 포인트 로직도 포함시켰음
    useEffect(() => {
        init();
    }, []);
    
    // 장바구니 업데이트 할때마다 요소 업데이트 하는 함수
    const cartCalculator = () => {
        updateCartSummary(); // 카트 총액 업데이트
        updateStockInfo(); // 품절 이슈 업데이트
        updateBonusPts(); // 상품 보너스 업데이트
    }
    
    // 보너스 혜택 표시 함수
    const updateBonusPts = () => {
        let $loyalPoint = document.getElementById('loyalty-points');
        bonusPoints = Math.floor(sumAmount / 1000);

        $loyalPoint = document.createElement('span');
        $loyalPoint.id = 'loyalty-points';
        $loyalPoint.className = 'text-blue-500 ml-2';

        const $sum = document.getElementById('cart-total');
        $sum && $sum.appendChild($loyalPoint);
    
        $loyalPoint.textContent = `(포인트: ${bonusPoints})`;
    }
    
    // 품절 상품 (재고부족 상품) 표시 함수
    const updateStockInfo = () => {
        const $stockInfo = document.getElementById('stock-status');
        if (!$stockInfo) return;

        let infoMsg = 
            productList.filter(item => item.stock < 5)
                .map(item => 
                `${item.name}: ${item.stock > 0
                    ? '재고 부족 (' + item.stock + '개 남음)'
                    : '품절'}`)
                .join('\n');
    
        $stockInfo.textContent = infoMsg;
    }

    // 콜백 구조로 랜덤 할인 알림 실행 : 초기화 단계
    const initRandomAlert = ({ 
        onFlashSale, 
        onSuggestion 
    }: {
        onFlashSale: FlashSaleCallback,
        onSuggestion: SuggestionCallback
    }) => {
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
                    
                    if (suggestItem) onSuggestion(suggestItem);
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

    // 첫 모든 로직 실행 함수
    const init = () => {
        cartCalculator();
    
        // 콜백 구조로 랜덤 할인 알림 실행
        initRandomAlert({
            onFlashSale: luckyItem => {
                luckyItem.price = Math.round(luckyItem.price * 0.8); // 20% 할인
                alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
            },
            onSuggestion: suggestItem => {
                suggestItem.price = Math.round(suggestItem.price * 0.95); // 5% 할인
                alert(`${suggestItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
            }
        });  
    }

    return (
        <div className="bg-gray-100 p-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
                <h1 className="text-2xl font-bold mb-4">장바구니</h1>
                <Cart
                    cartCalculator = {cartCalculator}
                    setLastSelected = {setLastSelected}
                />
                <div id="stock-status" className="text-sm text-gray-500 mt-2" />
            </div>
        </div>
    );
};

export default App;