import { productList, DISCOUNT_RATES } from "./datas"

let sumAmount: number = 0;

// 상품 별 할인 함수
const calculateDiscount = (productId: string, quantity: number): number => {
    return quantity >= 10 ? DISCOUNT_RATES[productId] || 0 : 0;
};

// 장바구니 총액 계산 함수
const calculateCartTotal = (cartItems: HTMLElement) => {
    let totalAmount = 0;
    let totalQuantity = 0;
    let subTotal = 0;

    // 장바구니 아이템 순회
    Array.from(cartItems.children).forEach((item) => {
        const span = item!.querySelector('span')
        if (!span) return;
        
        const itemId = item.id;
        const quantity = parseInt(span.textContent!.split('x ')[1]);
        const product = productList.find((p) => p.id === itemId);

        if (product) {
            const itemTotal = product.price * quantity;
            const discount = calculateDiscount(product.id, quantity);
            totalQuantity += quantity;
            subTotal += itemTotal;
            totalAmount += itemTotal * (1 - discount);
        }
    });

    return { totalAmount, totalQuantity, subTotal };
};

// 벌크 할인 계산 함수
const applyBulkDiscount = (totalAmount: number, subTotal: number, totalQuantity: number) => {
    let discountRate = 0;

    if (totalQuantity >= 30) {
    const bulkDiscount = subTotal * 0.25;
    const itemDiscount = subTotal - totalAmount;

        if (bulkDiscount > itemDiscount) {
            totalAmount = subTotal * 0.75;
            discountRate = 0.25;
        } else {
            discountRate = itemDiscount / subTotal;
        }
    } else {
        discountRate = (subTotal - totalAmount) / subTotal;
    }

    return { totalAmount, discountRate };
};

// 요일별 할인 적용 함수
const applyDayDiscount = (totalAmount: number, discountRate: number) => {
    const today = new Date().getDay();

    // 일~토 : 0~6
    if (today === 2) {
        totalAmount *= 0.9;
        discountRate = Math.max(discountRate, 0.1);
    }

    sumAmount = totalAmount;
    return { totalAmount, discountRate };
};

// 계산 결과 UI 적용 함수
const updateCartUI = (totalAmount: number, discountRate: number) => {
    const $sum = document.getElementById('cart-total');
    if (!$sum) return;

    $sum.textContent = `총액: ${Math.round(totalAmount)}원`;
  
    if (discountRate > 0) {
      const discountSpan = document.createElement('span');
      discountSpan.className = 'text-green-500 ml-2';
      discountSpan.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
      $sum.appendChild(discountSpan);
    }
};
  
// 장바구니 계산 메인 함수
const updateCartSummary = () => {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;
    
    const { totalAmount, totalQuantity, subTotal } = calculateCartTotal(cartItems);
    const bulkDiscountResult = applyBulkDiscount(totalAmount, subTotal, totalQuantity);
    const finalResult = applyDayDiscount(bulkDiscountResult.totalAmount, bulkDiscountResult.discountRate);
    updateCartUI(finalResult.totalAmount, finalResult.discountRate);
};

export { 
    updateCartSummary,
    sumAmount
}