import { PRODUCTS } from './constants';
import { createLayout } from './ui';
import { updateOptions, calculateCart } from './cart';

let lastSel;
const { $container, $cartDisp, $sel, $sum, $addButton, $stockInfo } = createLayout();

function main() {
	var $root = document.getElementById('app');
	$root.appendChild($container);

	updateOptions($sel);
	calculateCart($sum, $cartDisp, $stockInfo);

	setTimeout(function () {
		setInterval(function () {
			const luckyItem = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
			if (Math.random() < 0.3 && luckyItem.quantity > 0) {
				luckyItem.price = Math.round(luckyItem.price * 0.8);
				alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
				updateOptions();
			}
		}, 30000);
	}, Math.random() * 10000);

	setTimeout(function () {
		setInterval(function () {
			if (lastSel) {
				const suggestItem = PRODUCTS.find((item) => item.id !== lastSel && item.quantity > 0);
				if (suggestItem) {
					alert(suggestItem.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
					suggestItem.price = Math.round(suggestItem.price * 0.95);
					updateOptions();
				}
			}
		}, 60000);
	}, Math.random() * 20000);
}

main();

$addButton.addEventListener('click', function () {
	var selItem = $sel.value;
	var itemToAdd = PRODUCTS.find((p) => p.id === selItem);

	if (itemToAdd && itemToAdd.quantity > 0) {
		const item = document.getElementById(itemToAdd.id);
		if (item) {
			var newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
			if (newQty <= itemToAdd.quantity) {
				item.querySelector('span').textContent =
					itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;
				itemToAdd.quantity--;
			} else {
				alert('재고가 부족합니다.');
			}
		} else {
			var newItem = document.createElement('div');
			newItem.id = itemToAdd.id;
			newItem.className = 'flex justify-between items-center mb-2';
			newItem.innerHTML =
				'<span>' +
				itemToAdd.name +
				' - ' +
				itemToAdd.price +
				'원 x 1</span><div>' +
				'<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
				itemToAdd.id +
				'" data-change="-1">-</button>' +
				'<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
				itemToAdd.id +
				'" data-change="1">+</button>' +
				'<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
				itemToAdd.id +
				'">삭제</button></div>';
			$cartDisp.appendChild(newItem);
			itemToAdd.quantity--;
		}
		calculateCart();
		lastSel = selItem;
	}
});

$cartDisp.addEventListener('click', function (event) {
	const current = event.target;
	if (current.classList.contains('quantity-change') || current.classList.contains('remove-item')) {
		var prodId = current.dataset.productId;
		var itemElem = document.getElementById(prodId);
		var prod = PRODUCTS.find(function (p) {
			return p.id === prodId;
		});
		if (current.classList.contains('quantity-change')) {
			var qtyChange = parseInt(current.dataset.change);
			var newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;
			if (
				newQty > 0 &&
				newQty <=
					prod.quantity + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
			) {
				itemElem.querySelector('span').textContent =
					itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
				prod.quantity -= qtyChange;
			} else if (newQty <= 0) {
				itemElem.remove();
				prod.quantity -= qtyChange;
			} else {
				alert('재고가 부족합니다.');
			}
		} else if (current.classList.contains('remove-item')) {
			var remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
			prod.quantity += remQty;
			itemElem.remove();
		}
		calculateCart();
	}
});
