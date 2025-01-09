import { useCallback } from 'react';
import { DOM_ID } from '../constants';
import { alertOutOfStock } from '../models';
import { CartStore, ProductStore } from '../store';

export const AddButton = () => {
	const { cart, addCartItem: addCart, updateCartItem, setLastSelectedItemId } = CartStore();
	const { products, updateProducts } = ProductStore();

	const handleClickAddButton = useCallback(() => {
		const selectBox = document.getElementById(DOM_ID.SELECT_BOX) as HTMLSelectElement | null;
		if (!selectBox) return;

		const selectedId = selectBox.value;
		const selectedItem = products.find((p) => p.id === selectedId);

		if (selectedId && selectedItem && selectedItem.quantity > 0) {
			const cartItem = cart.find((item) => item.id === selectedId);

			if (selectedItem.quantity > 0) {
				updateProducts({ ...selectedItem, quantity: selectedItem.quantity - 1 });
				cartItem
					? updateCartItem({ ...selectedItem, quantity: cartItem.quantity + 1 })
					: addCart({ ...selectedItem, quantity: 1 });
			}

			setLastSelectedItemId(selectedId);
		} else {
			alertOutOfStock();
		}
	}, [cart, products]);

	return (
		<button
			id={DOM_ID.ADD_BUTTON}
			className="bg-blue-500 text-white px-4 py-2 rounded"
			onClick={handleClickAddButton}
		>
			추가
		</button>
	);
};
