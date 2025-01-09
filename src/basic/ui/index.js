import { DOM_ID } from '../constants';

export function createLayout() {
	const $root = document.getElementById('app');

	const $container = document.createElement('div');
	$container.className = 'bg-gray-100 p-8';

	const $wrapper = document.createElement('div');
	$wrapper.className =
		'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

	const $title = document.createElement('h1');
	$title.className = 'text-2xl font-bold mb-4';
	$title.textContent = '장바구니';

	const $cartContainer = document.createElement('div');
	$cartContainer.id = DOM_ID.CART_CONTAINER;

	const $sum = document.createElement('div');
	$sum.id = DOM_ID.CART_TOTAL;
	$sum.className = 'text-xl font-bold my-4';

	const $selectBox = document.createElement('select');
	$selectBox.id = DOM_ID.SELECT_BOX;
	$selectBox.className = 'border rounded p-2 mr-2';

	const $addButton = document.createElement('button');
	$addButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
	$addButton.id = DOM_ID.ADD_BUTTON;
	$addButton.textContent = '추가';

	const $stockStatus = document.createElement('div');
	$stockStatus.id = DOM_ID.STOCK_STATUS;
	$stockStatus.className = 'text-sm text-gray-500 mt-2';

	$wrapper.appendChild($title);
	$wrapper.appendChild($cartContainer);
	$wrapper.appendChild($sum);
	$wrapper.appendChild($selectBox);
	$wrapper.appendChild($addButton);
	$wrapper.appendChild($stockStatus);
	$container.appendChild($wrapper);
	$root.appendChild($container);
}

export function createNewItemInCart(item) {
	const $parent = document.getElementById(DOM_ID.CART_CONTAINER);
	const $newItem = document.createElement('div');

	$newItem.id = item.id;
	$newItem.className = 'flex justify-between items-center mb-2';
	$newItem.innerHTML =
		'<span>' +
		item.name +
		' - ' +
		item.price +
		'원 x 1</span><div>' +
		'<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
		item.id +
		'" data-change="-1">-</button>' +
		'<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
		item.id +
		'" data-change="1">+</button>' +
		'<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
		item.id +
		'">삭제</button></div>';

	$parent.appendChild($newItem);
}

export function createPoints() {
	const $parent = document.getElementById(DOM_ID.CART_TOTAL);
	const $points = document.createElement('span');

	$points.id = 'loyalty-points';
	$points.className = 'text-blue-500 ml-2';
	$parent.appendChild($points);

	return $points;
}

/**
 * 추가 할인 ui
 */
export function createDiscount(discountRate) {
	const $sum = document.getElementById(DOM_ID.CART_TOTAL);
	const $discount = document.createElement('span');

	$discount.className = 'text-green-500 ml-2';
	$discount.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
	$sum.appendChild($discount);
}
