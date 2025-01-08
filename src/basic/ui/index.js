export function createLayout() {
	let $container = document.createElement('div');
	$container.className = 'bg-gray-100 p-8';

	let $wrapper = document.createElement('div');
	$wrapper.className =
		'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

	let $title = document.createElement('h1');
	$title.className = 'text-2xl font-bold mb-4';
	$title.textContent = '장바구니';

	let $cartDisp = document.createElement('div');
	$cartDisp.id = 'cart-items';

	let $sum = document.createElement('div');
	$sum.className = 'text-xl font-bold my-4';
	$sum.id = 'cart-total';

	let $sel = document.createElement('select');
	$sel.id = 'product-select';
	$sel.className = 'border rounded p-2 mr-2';

	let $addButton = document.createElement('button');
	$addButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
	$addButton.id = 'add-to-cart';
	$addButton.textContent = '추가';

	let $stockInfo = document.createElement('div');
	$stockInfo.className = 'text-sm text-gray-500 mt-2';
	$stockInfo.id = 'stock-status';

	$wrapper.appendChild($title);
	$wrapper.appendChild($cartDisp);
	$wrapper.appendChild($sum);
	$wrapper.appendChild($sel);
	$wrapper.appendChild($addButton);
	$wrapper.appendChild($stockInfo);
	$container.appendChild($wrapper);

	return { $container, $title, $cartDisp, $sum, $sel, $stockInfo, $addButton };
}

export function createNewItem(parent, item) {
	let $newItem = document.createElement('div');
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

	parent.appendChild($newItem);
}

export function createOption() {}

export function createPoints(parent) {
	let $points = document.createElement('span');
	$points.id = 'loyalty-points';
	$points.className = 'text-blue-500 ml-2';
	parent.appendChild($points);

	return $points;
}
