import { SelectProduct } from './SelectProduct.js';
import { CartItems } from './CartItems.js';
import { TotalInfo } from './TotalInfo.js';
import { StockStatus } from './StockStatus.js';

export const CartTemplate = () => {
  return `
<div id="container" class="bg-gray-100 p-8">
<div id="wrapper" class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
<h1 class="text-2xl font-bold mb-4">장바구니</h1>${CartItems()}${TotalInfo()}${SelectProduct()}${StockStatus()}</div>
</div>`;
};
