import { productList } from "./userData"

let setTotalAmount = 0

// 상품 별 할인 함수
const calculateDiscount = (productId, quantity) => {
    const discountRates = {
      p1: 0.1,
      p2: 0.15,
      p3: 0.2,
      p4: 0.05,
      p5: 0.25,
    };

    return quantity >= 10 ? discountRates[productId] || 0 : 0;
};

// 장바구니 총액 계산 함수
const calculateCartTotal = (cartItems, productList) => {
    let totalAmount = 0;
    let totalQuantity = 0;
    let subTotal = 0;

    // 장바구니 아이템 순회
    Array.from(cartItems.children).forEach((item) => {
        const itemId = item.id;
        const quantity = parseInt(item.querySelector('span').textContent.split('x ')[1]);
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
const applyBulkDiscount = (totalAmount, subTotal, totalQuantity) => {
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
const applyDayDiscount = (totalAmount, discountRate) => {
    const today = new Date().getDay();

    // 일~토 : 0~6
    if (today === 2) {
        totalAmount *= 0.9;
        discountRate = Math.max(discountRate, 0.1);
    }

    setTotalAmount = totalAmount;
    return { totalAmount, discountRate };
};

// 계산 결과 UI 적용 함수
const updateCartUI = (totalAmount, discountRate) => {
    const sum = document.getElementById('cart-total');
    sum.textContent = `총액: ${Math.round(totalAmount)}원`;
  
    if (discountRate > 0) {
      const discountSpan = document.createElement('span');
      discountSpan.className = 'text-green-500 ml-2';
      discountSpan.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
      sum.appendChild(discountSpan);
    }
};
  
// 장바구니 계산 메인 함수
const updateCartSummary = () => {
    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
        const { totalAmount, totalQuantity, subTotal } = calculateCartTotal(cartItems, productList);
        const bulkDiscountResult = applyBulkDiscount(totalAmount, subTotal, totalQuantity);
        const finalResult = applyDayDiscount(bulkDiscountResult.totalAmount, bulkDiscountResult.discountRate);
        updateCartUI(finalResult.totalAmount, finalResult.discountRate);
    }
};

export { 
    updateCartSummary,
    setTotalAmount
}