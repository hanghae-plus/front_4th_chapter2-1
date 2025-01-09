interface CartItemProps {}

export const CartItem = (item: CartItemProps) => {
	const { name, price, id } = item;
	return (
		<div className="flex justify-between items-center mb-2">
			<span>{name} - 원 x 1</span>
		</div>
	);
};
