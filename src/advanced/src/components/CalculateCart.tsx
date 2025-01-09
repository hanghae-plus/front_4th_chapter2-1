
import { IProduct, ICartItem } from '../type/product';

export const calculateCart = (cartItems: ICartItem[], products: IProduct[]) => {
    let totalAmount = 0;
    let itemCount = 0;
    let discountRate = 0;

    cartItems.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
            const productTotalPrice = product.price * item.quantity;
            totalAmount += productTotalPrice;
            itemCount += item.quantity;
        }
    });

    // 대량 구매 할인 적용
    if (itemCount >= 30) {
        totalAmount *= 0.75; // 25% 할인
        discountRate = 0.25;
    }

    // 화요일 할인 적용
    if (new Date().getDay() === 2) {
        totalAmount *= 0.9; // 10% 할인
        discountRate = Math.max(discountRate, 0.1);
    }

    // 포인트 계산
    const loyaltyPoints = Math.floor(totalAmount / 1000);

    return {
        totalAmount: Math.round(totalAmount),
        discountRate,
        loyaltyPoints,
    };
};
