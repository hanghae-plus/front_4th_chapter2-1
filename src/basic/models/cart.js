import { DISCOUNT_PER_PRODUCTS, PRODUCTS } from '../constants';
import { createPoints } from '../ui';

/**
 * 상품 선택 option 업데이트
 */
export function updateOptions($sel) {
	$sel.innerHTML = '';

	PRODUCTS.forEach((item) => {
		const $option = document.createElement('option');
		$option.value = item.id;
		$option.textContent = `${item.name} - ${item.price}원`;
		if (item.quantity === 0) $option.disabled = true;
		$sel.appendChild($option);
	});
}

/**
 * 장바구니 내역 계산
 */
export function calculateCart($sum, $cartDisp, $stockInfo) {
	let totalAmount = 0;
	let itemCount = 0; // 아이템 개수
	let totalBeforeDiscount = 0; // 할인 금액 적용 전 총합

	const cartItems = $cartDisp.children;

	for (const cartItem of cartItems) {
		const currentItem = PRODUCTS.find((product) => product.id === cartItem.id);

		const quantity = parseInt(cartItem.querySelector('span').textContent.split('x ')[1]);
		const itemTotal = currentItem.price * quantity; // 아이템 별 금액 총합
		itemCount += quantity;

		totalBeforeDiscount += itemTotal;

		let discount = 0;
		if (q >= 10) {
			disc = DISCOUNT_PER_PRODUCTS[currentItem.id];
		}
		totalAmount += itemTotal * (1 - discount);
	}

	let discRate = 0;

	if (itemCount >= 30) {
		var bulkDisc = totalAmount * 0.25;
		var itemDisc = totalBeforeDiscount - totalAmount;

		if (bulkDisc > itemDisc) {
			totalAmount = totalBeforeDiscount * (1 - 0.25);
			discRate = 0.25;
		} else {
			discRate = (totalBeforeDiscount - totalAmount) / totalBeforeDiscount;
		}
	} else {
		discRate = (totalBeforeDiscount - totalAmount) / totalBeforeDiscount;
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
	const point = Math.floor(total / 1000);

	let $points = document.getElementById('loyalty-points');
	if (!$points) {
		$points = createPoints($sum);
	}

	$points.textContent = '(포인트: ' + point + ')';
}

/**
 * 재고 업데이트
 */
function updateStockInfo($stockInfo) {
	let infoMessage = '';

	PRODUCTS.forEach((item) => {
		if (item.quantity < 5) {
			infoMessage +=
				(item.quantity > 0
					? `${item.name}: 재고 부족 (${item.quantity})개 남음`
					: `${item.name}: 품절`) + '\n';
		}
	});

	$stockInfo.textContent = infoMessage;
}
