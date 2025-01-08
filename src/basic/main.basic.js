import { PRODUCTS } from './constants';
import { createLayout, createNewItem } from './ui';
import {
	updateOptions,
	calculateCart,
	alert20PercentSale,
	alert5PercentSale,
	alertOutOfStock,
} from './models';

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
				alert20PercentSale(luckyItem.name);
				updateOptions();
			}
		}, 30000);
	}, Math.random() * 10000);

	setTimeout(function () {
		setInterval(function () {
			if (lastSel) {
				const suggestItem = PRODUCTS.find((item) => item.id !== lastSel && item.quantity > 0);
				if (suggestItem) {
					alert5PercentSale(suggestItem.name);
					suggestItem.price = Math.round(suggestItem.price * 0.95);
					updateOptions();
				}
			}
		}, 60000);
	}, Math.random() * 20000);
}

main();

$addButton.addEventListener('click', function () {
	const selectedId = $sel.value;

	let selectedItem = PRODUCTS.find((p) => p.id === selectedId);

	if (selectedItem && selectedItem.quantity > 0) {
		const $item = document.getElementById(selectedItem.id);

		if ($item) {
			const count = parseInt($item.querySelector('span').textContent.split('x ')[1]) + 1;
			if (count <= selectedItem.quantity) {
				$item.querySelector('span').textContent =
					selectedItem.name + ' - ' + selectedItem.price + '원 x ' + count;
				selectedItem.quantity--;
			} else {
				alertOutOfStock();
			}
		} else {
			createNewItem($cartDisp, selectedItem);
			selectedItem.quantity--;
		}

		calculateCart($sum, $cartDisp, $stockInfo);
		lastSel = selectedId;
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
				alertOutOfStock();
			}
		} else if (current.classList.contains('remove-item')) {
			var remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
			prod.quantity += remQty;
			itemElem.remove();
		}
		calculateCart($sum, $cartDisp, $stockInfo);
	}
});
