import { useMemo } from 'react';
import { DOM_ID } from '../constants';
import { updateStockInfo } from '../models';
import { ProductStore } from '../store';

export const StockStatus = () => {
	const products = ProductStore().products;

	const getStockInfo = useMemo(() => {
		return updateStockInfo(products);
	}, [products]);

	return (
		<div id={DOM_ID.STOCK_STATUS} className="text-sm text-gray-500 mt-2">
			{getStockInfo}
		</div>
	);
};
