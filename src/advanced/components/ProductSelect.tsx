import React from 'react';
import { Product } from "../App";

interface ProductSelectProps {
	productList: Product[];
}

const ProductSelect: React.FC<ProductSelectProps> = ({ productList }) => {
	return (
		<div>
			<select 
				id="product-select"
				className="border rounded p-2 mr-2"
			>
				<option value="">상품을 선택하세요</option>
				{productList.map(product => (
					<option key={product.id} value={product.id}>
						{product.name} - {product.price}원
					</option>
				))}
			</select>

			<button
				id="add-to-cart"
				className="bg-blue-500 text-white px-4 py-2 rounded"
			>
				추가
			</button>
		</div>
	)
}

export default ProductSelect;