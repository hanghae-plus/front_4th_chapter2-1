export interface IproductList {
	id: string;
	name: string;
	price: number;
	quantity: number;
}

export interface CartItem {
	product: IproductList;
	quantity: number;
}