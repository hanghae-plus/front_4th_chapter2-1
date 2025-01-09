import { DOM_ID } from '../constants';
import { ProductStore } from '../store/productStore';

export const SelectBox = () => {
	const products = ProductStore().products;

	return (
		<select id={DOM_ID.SELECT_BOX} className="border rounded p-2 mr-2">
			{products.map((product) => (
				<option key={product.id} disabled={product.quantity === 0} value={product.id}>
					{product.name} - {product.price}원
				</option>
			))}
		</select>
	);
};
