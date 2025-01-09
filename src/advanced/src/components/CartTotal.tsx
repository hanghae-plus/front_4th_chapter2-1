interface ICartTotalProps {
    totalAmount: number;
    discountRate: number;
    loyaltyPoints: number;
}

const CartTotal: React.FC<ICartTotalProps> = ({ totalAmount, discountRate, loyaltyPoints }) => {
    return (
        <div id="cart-total" className="text-xl font-bold my-4">
            <span>총액: {totalAmount.toLocaleString()}원</span>
            {discountRate > 0 && (
                <span className="text-green-500 ml-2">
                    ({(discountRate * 100).toFixed(1)}% 할인 적용)
                </span>
            )}
            <span className="text-blue-500 ml-2">(포인트: {loyaltyPoints})</span>
        </div>
    );
};

export default CartTotal;
