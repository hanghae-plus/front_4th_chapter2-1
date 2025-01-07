import { PRODUCTS } from './constants';
import createLayout from './ui';

let lastSel,
	bonusPts = 0,
	totalAmt = 0,
	itemCnt = 0;

const { $container, $cartDisp, $sum, $sel, $stockInfo, $addButton } = createLayout();

function main() {
	var $root = document.getElementById('app');
	$root.appendChild($container);

	updateSelOpts();
	calcCart();

	setTimeout(function () {
		setInterval(function () {
			var luckyItem = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
			if (Math.random() < 0.3 && luckyItem.q > 0) {
				luckyItem.val = Math.round(luckyItem.val * 0.8);
				alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
				updateSelOpts();
			}
		}, 30000);
	}, Math.random() * 10000);

	setTimeout(function () {
		setInterval(function () {
			if (lastSel) {
				var suggest = PRODUCTS.find(function (item) {
					return item.id !== lastSel && item.q > 0;
				});
				if (suggest) {
					alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
					suggest.val = Math.round(suggest.val * 0.95);
					updateSelOpts();
				}
			}
		}, 60000);
	}, Math.random() * 20000);
}

function updateSelOpts() {
	$sel.innerHTML = '';
	PRODUCTS.forEach(function (item) {
		var opt = document.createElement('option');
		opt.value = item.id;
		opt.textContent = item.name + ' - ' + item.val + '원';
		if (item.q === 0) opt.disabled = true;
		$sel.appendChild(opt);
	});
}

function calcCart() {
	totalAmt = 0;
	itemCnt = 0;

	var cartItems = $cartDisp.children;
	var subTot = 0;

	for (var i = 0; i < cartItems.length; i++) {
		(function () {
			var curItem;
			for (var j = 0; j < PRODUCTS.length; j++) {
				if (PRODUCTS[j].id === cartItems[i].id) {
					curItem = PRODUCTS[j];
					break;
				}
			}
			var q = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
			var itemTot = curItem.val * q;
			var disc = 0;
			itemCnt += q;
			subTot += itemTot;
			if (q >= 10) {
				if (curItem.id === 'p1') disc = 0.1;
				else if (curItem.id === 'p2') disc = 0.15;
				else if (curItem.id === 'p3') disc = 0.2;
				else if (curItem.id === 'p4') disc = 0.05;
				else if (curItem.id === 'p5') disc = 0.25;
			}
			totalAmt += itemTot * (1 - disc);
		})();
	}
	let discRate = 0;
	if (itemCnt >= 30) {
		var bulkDisc = totalAmt * 0.25;
		var itemDisc = subTot - totalAmt;
		if (bulkDisc > itemDisc) {
			totalAmt = subTot * (1 - 0.25);
			discRate = 0.25;
		} else {
			discRate = (subTot - totalAmt) / subTot;
		}
	} else {
		discRate = (subTot - totalAmt) / subTot;
	}
	if (new Date().getDay() === 2) {
		totalAmt *= 1 - 0.1;
		discRate = Math.max(discRate, 0.1);
	}
	$sum.textContent = '총액: ' + Math.round(totalAmt) + '원';
	if (discRate > 0) {
		var span = document.createElement('span');
		span.className = 'text-green-500 ml-2';
		span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
		$sum.appendChild(span);
	}
	updateStockInfo();
	renderBonusPts();
}

const renderBonusPts = () => {
	bonusPts = Math.floor(totalAmt / 1000);
	var ptsTag = document.getElementById('loyalty-points');
	if (!ptsTag) {
		ptsTag = document.createElement('span');
		ptsTag.id = 'loyalty-points';
		ptsTag.className = 'text-blue-500 ml-2';
		$sum.appendChild(ptsTag);
	}
	ptsTag.textContent = '(포인트: ' + bonusPts + ')';
};

function updateStockInfo() {
	var infoMsg = '';
	PRODUCTS.forEach(function (item) {
		if (item.q < 5) {
			infoMsg +=
				item.name + ': ' + (item.q > 0 ? '재고 부족 (' + item.q + '개 남음)' : '품절') + '\n';
		}
	});
	$stockInfo.textContent = infoMsg;
}

main();

$addButton.addEventListener('click', function () {
	var selItem = $sel.value;
	var itemToAdd = PRODUCTS.find(function (p) {
		return p.id === selItem;
	});
	if (itemToAdd && itemToAdd.q > 0) {
		var item = document.getElementById(itemToAdd.id);
		if (item) {
			var newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
			if (newQty <= itemToAdd.q) {
				item.querySelector('span').textContent =
					itemToAdd.name + ' - ' + itemToAdd.val + '원 x ' + newQty;
				itemToAdd.q--;
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
				itemToAdd.val +
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
			itemToAdd.q--;
		}
		calcCart();
		lastSel = selItem;
	}
});

$cartDisp.addEventListener('click', function (event) {
	var tgt = event.target;
	if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
		var prodId = tgt.dataset.productId;
		var itemElem = document.getElementById(prodId);
		var prod = PRODUCTS.find(function (p) {
			return p.id === prodId;
		});
		if (tgt.classList.contains('quantity-change')) {
			var qtyChange = parseInt(tgt.dataset.change);
			var newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;
			if (
				newQty > 0 &&
				newQty <= prod.q + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
			) {
				itemElem.querySelector('span').textContent =
					itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
				prod.q -= qtyChange;
			} else if (newQty <= 0) {
				itemElem.remove();
				prod.q -= qtyChange;
			} else {
				alert('재고가 부족합니다.');
			}
		} else if (tgt.classList.contains('remove-item')) {
			var remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
			prod.q += remQty;
			itemElem.remove();
		}
		calcCart();
	}
});
