import { IProduct, ICartItem } from '../type/product';
import { BULK_DISCOUNT_THRESHOLD, BULK_DISCOUNT_RATE, PRODUCT_DISCOUNT_AMOUNT, PRODUCT_DISCOUNT_RATE, TUESDAY, TUESDAY_DISCOUNT, LOYALTY_POINTS_THRESHOLD} from '../constants/constants';

export const calculateCart = (cartItems: ICartItem[], products: IProduct[]) => {
    let totalAmount = 0;
    let itemCount = 0;
    let discountRate = 0;

    cartItems.forEach((item) => {
        const product = item.product ? products.find((p) => p.id === item.product.id) : undefined;
        if (product) {
            const quantity = item.quantity;
            const productDiscount = (quantity >= PRODUCT_DISCOUNT_AMOUNT)
                ? (PRODUCT_DISCOUNT_RATE[product.id as keyof typeof PRODUCT_DISCOUNT_RATE] || 0) // 할인율 적용
                : 0;

            const itemTotalPrice = product.price * quantity * (1 - productDiscount);
            totalAmount += itemTotalPrice;
            itemCount += quantity;
        }
    });

    // 대량 구매 할인 적용
    if (itemCount >= BULK_DISCOUNT_THRESHOLD) {
        totalAmount *= 1 - BULK_DISCOUNT_RATE; // 25% 할인
        discountRate = Math.max(discountRate, BULK_DISCOUNT_RATE);
    }

    // 화요일 할인 적용
    if (new Date().getDay() === TUESDAY) {
        totalAmount *= 1 - TUESDAY_DISCOUNT; // 10% 할인
        discountRate = Math.max(discountRate, TUESDAY_DISCOUNT);
    }

    // 포인트 계산
    const loyaltyPoints = Math.floor(totalAmount / LOYALTY_POINTS_THRESHOLD);

    return {
        totalAmount: Math.round(totalAmount),
        discountRate,
        loyaltyPoints,
    };
};