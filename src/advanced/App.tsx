import { useEffect, useState } from 'react';
import { AddButton, CartContainer, CartTotal, SelectBox, StockStatus, Title } from './components';
import { calculateCart, setupSaleEvents } from './models/cart';
import { CartStore } from './store/cartStore';

const App = () => {
	const cart = CartStore().cart;
	const [total, setTotal] = useState(0);
	const [discount, setDiscount] = useState(0);

	useEffect(() => {
		setupSaleEvents();
	}, []);

	useEffect(() => {
		const { totalAmount, discountRate } = calculateCart();
		setTotal(totalAmount);
		setDiscount(discountRate);
	}, [cart]);

	return (
		<div className="bg-gray-100 p-8">
			<div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
				<Title />
				<CartContainer />
				<CartTotal totalAmount={total} discountRate={discount} />
				<SelectBox />
				<AddButton />
				<StockStatus />
			</div>
		</div>
	);
};
export default App;
