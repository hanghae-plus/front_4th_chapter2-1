import { useEffect, useMemo, useState } from 'react';
import { AddButton, CartContainer, CartTotal, SelectBox, StockStatus, Title } from './components';
import { calculateCart, setupSaleEvents } from './models';
import { CartStore } from './store';

const App = () => {
	const cart = CartStore().cart;

	const { totalAmount, discountRate } = useMemo(() => {
		return calculateCart();
	}, [cart]);

	useEffect(() => {
		setupSaleEvents(); // alert event 설정
	}, []);

	return (
		<div className="bg-gray-100 p-8">
			<div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
				<Title />
				<CartContainer />
				<CartTotal totalAmount={totalAmount} discountRate={discountRate} />
				<SelectBox />
				<AddButton />
				<StockStatus />
			</div>
		</div>
	);
};
export default App;
