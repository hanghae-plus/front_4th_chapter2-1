import React from "react";
// import { cartCalculator } from "../models/"

interface Product {
    id: string;
    name: string;
    val: number;
    q: number;
}
  
interface AddButtonProps {
    productList: Product[];
    cartCalculator: () => void;
    lastSelected: string;
    setLastSelected: React.Dispatch<React.SetStateAction<string>>;
}

const AddButton: React.FC<AddButtonProps> = ({
    productList,
    cartCalculator,
    lastSelected,
    setLastSelected
}) => {
//     const handleAddtoCart = () => {
//         const $select = document.getElementById('product-select') as HTMLSelectElement;
//         const selectItem = $select.value;
//         const itemToAdd = productList.find((p) => p.id === selectItem);
    
//         if (!itemToAdd || itemToAdd.q <= 0) {
//             alert('재고가 부족합니다. case1');
//             return;
//         }
    
//         const existingItem = document.getElementById(itemToAdd.id);
//         if (existingItem) {
//             const qtySpan = existingItem.querySelector('span');
//             const currentQty = parseInt(qtySpan?.textContent?.split('x ')[1] || '0', 10);
//             const newQty = currentQty + 1;

//             if (newQty <= itemToAdd.q) {
//                 qtySpan!.textContent = `${itemToAdd.name} - ${itemToAdd.val}원 x ${newQty}`;
//                 itemToAdd.q--;
//             } else {
//                 alert('재고가 부족합니다.');
//             }
//         } else {
//             const newItem = document.createElement('div');
//             newItem.id = itemToAdd.id;
//             newItem.className = 'flex justify-between items-center mb-2';
//             newItem.innerHTML = `
//                 <span>${itemToAdd.name} - ${itemToAdd.val}원 x 1</span>
//                 <div>
//                 <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
//                 <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
//                 <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
//                 </div>`;
//             const cartItems = document.getElementById('cart-items');
//             if (cartItems) {
//                 cartItems.appendChild(newItem);
//                 handleCartControll(cartItems);
//             }
//             itemToAdd.q--;
//         }
    
//         cartCalculator();
//         lastSelected=selectItem;
//     }
    
//     // 장바구니 컨트롤 이벤트 리스너
//     const handleCartControll = (cartItems: HTMLElement) => {
//         cartItems.addEventListener('click', event => {
//             const target = event.target as HTMLElement;
            
//             // 관련 버튼이 아니면 early return
//             if (
//                 !target.classList.contains('quantity-change') && 
//                 !target.classList.contains('remove-item')) {
//                 return; 
//             }
            
//             const productId = target.dataset.productId!;
//             const $item = document.getElementById(productId);
//             const product = productList.find((p) => p.id === productId);
            
//             if (target.classList.contains('quantity-change')) {
//                 const qtyChange = parseInt(target.dataset.change!);
//                 $item && updateQuantity($item, product!, qtyChange);
//             } else if (target.classList.contains('remove-item')) {
//                 $item && removeItem($item, product);
//             }
            
//             cartCalculator(); // 장바구니 총합 계산
//         });
    
//         // 아이템 삭제 함수
//         const removeItem = ($item, prod) => {
//             const currentQty = parseInt($item.querySelector('span').textContent.split('x ')[1]);
//             prod.q += currentQty;
//             $item.remove();
//         }
    
//         // 재고 업데이트 함수
//         const updateQuantit = ($item: HTMLElement, product: Product, qtyChange: number) => {
//             const currentQty = parseInt($item.querySelector('span').textContent.split('x ')[1]);
//             const newQty = currentQty + qtyChange;
            
//             if (newQty <= 0) {
//                 $item.remove();
//                 prod.q += currentQty;
//             } else if (newQty <= prod.q + currentQty) {
//                 $item.querySelector('span').textContent = `${prod.name} - ${prod.val}원 x ${newQty}`;
//                 prod.q -= qtyChange;
//             } else {
//                 alert('재고가 부족합니다.');
//             }
//         }  
//     }

    return (
        <button 
            id="add-to-cart" 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            // onClick={handleAddtoCart}
        >
            추가
        </button>
    )
};

export default AddButton;