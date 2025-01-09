export interface IProduct {
	id: string;
	name: string;
	price: number;
	quantity: number;
}

export interface ICartItem {
	product: IProduct;
	quantity: number;
}