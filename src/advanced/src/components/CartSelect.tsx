import { IproductList } from '../type/product';

interface CartSelectProps {
	products: IproductList[];
	addToCart: (productId: string) => void;
}


export default function CartSelect({ products, addToCart }: CartSelectProps) {
	return (
		<>
			<select
				id="product-select"
				className="border rounded p-2 mr-2"
				onChange={(e) => addToCart(e.target.value)}
			>
				<option value="">상품 선택</option>
				{products.map((product) => (
					<option key={product.id} value={product.id}>
						{product.name}
					</option>
				))}
			</select>
			<button id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
		</>
	);
}