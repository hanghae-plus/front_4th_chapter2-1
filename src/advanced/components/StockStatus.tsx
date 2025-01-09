import { DOM_ID } from '../constants';
import { updateStockInfo } from '../models/cart';
import { ProductStore } from '../store/productStore';

export const StockStatus = () => {
	const products = ProductStore().products;

	return (
		<div id={DOM_ID.STOCK_STATUS} className="text-sm text-gray-500 mt-2">
			{updateStockInfo(products)}
		</div>
	);
};
