import { DOM_ID } from '../constants';
import { alertOutOfStock } from '../models/alert';
import { calculateCart } from '../models/cart';

import { CartStore } from '../store/cartStore';
import { ProductStore } from '../store/productStore';

export const CartContainer = () => {
	const { cart, updateCart, removeCartItem } = CartStore();
	const { products, setProducts } = ProductStore();

	const handleClickCart = (event: React.MouseEvent<HTMLDivElement>) => {
		const $button = event.target as HTMLElement;
		const itemId = $button.dataset.productId;
		if (!itemId) return;

		const selectedCartItem = cart.find((product) => product.id === itemId);
		const selectedStockItem = products.find((products) => products.id === itemId);
		if (!selectedCartItem || !selectedStockItem) return;

		if ($button.classList.contains('quantity-change')) {
			const changeQuantity = parseInt($button.dataset.change || '0');
			const newQuantity = selectedCartItem.quantity + changeQuantity;

			if (newQuantity > 0 && selectedStockItem.quantity - changeQuantity >= 0) {
				updateCart({ ...selectedCartItem, quantity: newQuantity });
				setProducts({
					...selectedStockItem,
					quantity: selectedStockItem.quantity - changeQuantity,
				});
			} else if (newQuantity <= 0) {
				setProducts({
					...selectedStockItem,
					quantity: selectedStockItem.quantity - changeQuantity,
				});
				removeCartItem(selectedCartItem);
			} else {
				alertOutOfStock();
			}
			calculateCart();
		} else if ($button.classList.contains('remove-item')) {
			setProducts({
				...selectedStockItem,
				quantity: selectedStockItem.quantity + selectedCartItem.quantity,
			});
			removeCartItem(selectedCartItem);
			calculateCart();
		}
	};

	return (
		<div id={DOM_ID.CART_CONTAINER} onClick={handleClickCart}>
			{cart.map((item) => (
				<div className="flex justify-between items-center mb-2" key={item.id}>
					<span id={item.id} key={item.id}>
						{item.name} - {item.price}원 x {item.quantity}
					</span>
					<div>
						<button
							className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
							data-product-id={item.id}
							data-change="-1"
						>
							-
						</button>
						<button
							className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
							data-product-id={item.id}
							data-change="+1"
						>
							+
						</button>
						<button
							className="remove-item bg-red-500 text-white px-2 py-1 rounded"
							data-product-id={item.id}
						>
							삭제
						</button>
					</div>
				</div>
			))}
		</div>
	);
};
