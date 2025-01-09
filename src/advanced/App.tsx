import React from 'react';
import ProductSelect from "./components/ProductSelect";

const ITEM_BY_DISCOUNT_RATE = {
	p1: 0.1,
	p2: 0.15,
	p3: 0.2,
	p4: 0.05,
	p5: 0.25,
};
const TUESDAY_DISCOUNT_RATE = 0.1;
const BULK_DISCOUNT_RATE = 0.25;

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const productList: Product[] = [
	{ id: 'p1', name: '상품1', price: 10000, quantity: 50 },
	{ id: 'p2', name: '상품2', price: 20000, quantity: 30 },
	{ id: 'p3', name: '상품3', price: 30000, quantity: 20 },
	{ id: 'p4', name: '상품4', price: 15000, quantity: 0 },
	{ id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

const App: React.FC = () => {

	return (
		<div className="bg-gray-100 p-8">
			<div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
				<h1 className="text-2xl font-bold mb-4">
					장바구니
				</h1>
				<div id="cart-items" />
        
        <div id="cart-total" className="text-xl font-bold my-4" />
        
        <ProductSelect productList={productList} />
        
        <div 
          id="stock-status"
          className="text-sm text-gray-500 mt-2"
        />
			</div>
		</div>
	)
}

export default App;