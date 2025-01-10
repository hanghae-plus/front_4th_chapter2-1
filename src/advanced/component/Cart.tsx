import React from "react";
import { productList, Product } from "../model/datas";

import SelectProduct from "./SelectProduct";
import Buttons from "./Buttons";
  
interface ButtonsProps {
    cartCalculator: () => void;
    setLastSelected: React.Dispatch<React.SetStateAction<string | null>>;
}

const Cart: React.FC<ButtonsProps> = ({
    cartCalculator,
    setLastSelected
}) => {
    // 추가 버튼과 Products 컨트롤 버튼의 부모 컴포넌트 역할을 한다
    // 두 이벤트 리스너를 가지고 있다
    const handleAddtoCart = () => {
        const $select = document.getElementById('product-select') as HTMLSelectElement || null;
        const selectItem = $select.value;
        const itemToAdd = productList.find((p) => p.id === selectItem);
    
        if (!itemToAdd || itemToAdd.stock <= 0) {
            alert('재고가 부족합니다.');
            return;
        }
    
        const existingItem = document.getElementById(itemToAdd.id);
        if (existingItem) {
            const qtySpan = existingItem.querySelector('span');
            const currentQty = parseInt(qtySpan?.textContent?.split('x ')[1] || '0', 10);
            const newQty = currentQty + 1;

            if (newQty <= itemToAdd.stock) {
                qtySpan!.textContent = `${itemToAdd.name} - ${itemToAdd.price}원 x ${newQty}`;
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
            }
            itemToAdd.stock--;
        }
    
        cartCalculator();
        setLastSelected(selectItem);
    }
    
    // 장바구니 컨트롤 이벤트 리스너
    const handleCartControll = (event: React.MouseEvent) => {
        const target = event.target as HTMLElement;
            
        // 관련 버튼이 아니면 early return
        if (!target.classList.contains('quantity-change') 
            && !target.classList.contains('remove-item'))
        return;
        
        const productId = target.dataset.productId!;
        const $item = document.getElementById(productId);
        const product = productList.find((p) => p.id === productId);
        
        if (target.classList.contains('quantity-change')) {
            const changeVal = parseInt(target.dataset.change!);
            updateStocks($item!, product!, changeVal);
        } else if (target.classList.contains('remove-item')) {
            removeItem($item!, product!);
        }
        
        cartCalculator(); // 장바구니 총합 계산;
    }
    
    // 아이템 삭제 함수
    const removeItem = ($item: HTMLElement, product: Product) => {
        const span = $item.querySelector('span');
        if (!span) return; // 요소를 찾을 수 없어 얼리리턴
    
        const currentQty = parseInt(span.textContent?.split('x ')[1] ?? '0');
        product.stock += currentQty;
        $item.remove();
    }

    // 재고 업데이트 함수
    const updateStocks = ($item: HTMLElement, product: Product, changeVal: number) => {
        const span = $item.querySelector('span');
        if (!span) return; // 요소를 찾을 수 없어 얼리리턴
        
        const currentQty = parseInt(span.textContent?.split('x ')[1] || '0');
        const newQty = currentQty + changeVal;
        
        
        if (newQty <= 0) {
            $item.remove();
            product.stock += currentQty;
        } else if (newQty <= product.stock + currentQty) {
            span.textContent = `${product.name} - ${product.price}원 x ${newQty}`;
            product.stock -= changeVal;
        } else {
            alert('재고가 부족합니다.');
        }
    }

    return (
        <>
            <div id="cart-items" onClick={handleCartControll}/>
            <div id="cart-total" className="text-xl font-bold my-4" />
            <SelectProduct />
            <Buttons handleAddButton={handleAddtoCart}/>
        </>
    )
};

export default Cart;