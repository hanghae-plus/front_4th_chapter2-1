import { DOM_ID } from '../constants';

interface ICartTotalProps {
	totalAmount: number;
	discountRate: number;
}

export const CartTotal = ({ totalAmount, discountRate }: ICartTotalProps) => {
	return (
		<div id={DOM_ID.CART_TOTAL} className="text-xl font-bold my-4">
			총액: {Math.round(totalAmount)}원
			{discountRate > 0 && (
				<span className="text-green-500 ml-2">({(discountRate * 100).toFixed(1)}% 할인 적용)</span>
			)}
			{totalAmount > 0 && (
				<span id={DOM_ID.POINTS} className="text-blue-500 ml-2">
					(포인트: {Math.floor(totalAmount / 1000)})
				</span>
			)}
		</div>
	);
};
