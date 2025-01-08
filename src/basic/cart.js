import { PRODUCTS } from './constants';

/**
 * 상품 선택 option 업데이트
 */
export function updateOptions($sel) {
	$sel.innerHTML = '';

	PRODUCTS.forEach((item) => {
		const option = document.createElement('option');
		option.value = item.id;
		option.textContent = item.name + ' - ' + item.price + '원';
		if (item.quantity === 0) option.disabled = true;
		$sel.appendChild(option);
	});
}

/**
 * 장바구니 내역 계산
 */
export function calculateCart($sum, $cartDisp, $stockInfo) {
	let totalAmount = 0;
	let itemCount = 0;

	const cartItems = $cartDisp.children;
	let subTot = 0;

	for (var i = 0; i < cartItems.length; i++) {
		(function () {
			let currentItem;
			for (let j = 0; j < PRODUCTS.length; j++) {
				if (PRODUCTS[j].id === cartItems[i].id) {
					currentItem = PRODUCTS[j];
					break;
				}
			}
			var q = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
			var itemTot = currentItem.price * q;
			var disc = 0;
			itemCount += q;
			subTot += itemTot;

			if (q >= 10) {
				if (currentItem.id === 'p1') disc = 0.1;
				else if (currentItem.id === 'p2') disc = 0.15;
				else if (currentItem.id === 'p3') disc = 0.2;
				else if (currentItem.id === 'p4') disc = 0.05;
				else if (currentItem.id === 'p5') disc = 0.25;
			}
			totalAmount += itemTot * (1 - disc);
		})();
	}

	let discRate = 0;
	if (itemCount >= 30) {
		var bulkDisc = totalAmount * 0.25;
		var itemDisc = subTot - totalAmount;
		if (bulkDisc > itemDisc) {
			totalAmount = subTot * (1 - 0.25);
			discRate = 0.25;
		} else {
			discRate = (subTot - totalAmount) / subTot;
		}
	} else {
		discRate = (subTot - totalAmount) / subTot;
	}
	if (new Date().getDay() === 2) {
		totalAmount *= 1 - 0.1;
		discRate = Math.max(discRate, 0.1);
	}

	$sum.textContent = '총액: ' + Math.round(totalAmount) + '원';

	if (discRate > 0) {
		var span = document.createElement('span');
		span.className = 'text-green-500 ml-2';
		span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
		$sum.appendChild(span);
	}

	updateStockInfo($stockInfo);
	renderPoints(totalAmount, $sum);
}

/**
 * 포인트 section 렌더링
 */
function renderPoints(total, $sum) {
	let points = Math.floor(total / 1000);
	var ptsTag = document.getElementById('loyalty-points');
	if (!ptsTag) {
		ptsTag = document.createElement('span');
		ptsTag.id = 'loyalty-points';
		ptsTag.className = 'text-blue-500 ml-2';
		$sum.appendChild(ptsTag);
	}
	ptsTag.textContent = '(포인트: ' + points + ')';
}

/**
 * 재고 업데이트
 */
function updateStockInfo($stockInfo) {
	let infoMessage = '';
	PRODUCTS.forEach((item) => {
		if (item.quantity < 5) {
			infoMessage +=
				item.name +
				': ' +
				(item.quantity > 0 ? '재고 부족 (' + item.quantity + '개 남음)' : '품절') +
				'\n';
		}
	});
	$stockInfo.textContent = infoMessage;
}
