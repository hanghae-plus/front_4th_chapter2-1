import {
	DISCOUNT_PER_PRODUCTS,
	DISCOUNT_RATE,
	DOM_ID,
	PRODUCTS,
	STOCK_ALERT_THRESHOLDS,
} from '../constants';
import { createDiscount, createNewItemInCart, createPoints } from '../ui';
import { alert20PercentSale, alert5PercentSale, alertOutOfStock } from './alert';

let lastSelectedItem;

/**
 * 상품 선택 option 업데이트
 */
export function updateOptions() {
	const $selectBox = document.getElementById(DOM_ID.SELECT_BOX);
	$selectBox.innerHTML = '';

	PRODUCTS.forEach((item) => {
		const $option = document.createElement('option');
		$option.value = item.id;
		$option.textContent = `${item.name} - ${item.price}원`;
		$option.disabled = item.quantity === 0;
		$selectBox.appendChild($option);
	});
}

/**
 * 현재 상품 개수 추출
 */
export function getItemQuantity($itemElement) {
	const count = parseInt($itemElement.querySelector('span').textContent.split('x ')[1]);
	return count;
}

/**
 * 장바구니 내역 계산
 */
export function calculateCart() {
	const $sum = document.getElementById(DOM_ID.CART_TOTAL);
	const $cartContainer = document.getElementById(DOM_ID.CART_CONTAINER);

	let totalAmount = 0; // 총합
	let itemCount = 0; // 아이템 개수
	let totalBeforeDiscount = 0; // 할인 금액 적용 전 총합

	Array.from($cartContainer.children).forEach((cartItem) => {
		const currentItem = PRODUCTS.find((product) => product.id === cartItem.id);
		if (!currentItem) return;

		const quantity = getItemQuantity(cartItem);
		const itemTotal = currentItem.price * quantity; // 아이템 별 금액 총합

		itemCount += quantity;
		totalBeforeDiscount += itemTotal;

		// 10개 이상 주문 시 할인
		const discount = quantity >= 10 ? DISCOUNT_PER_PRODUCTS[currentItem.id] : 0;
		totalAmount += itemTotal * (1 - discount);
	});

	let discountRate = applyDiscounts(
		itemCount,
		totalAmount,
		totalBeforeDiscount,
		new Date().getDay(),
	); // 할인율 계산

	$sum.textContent = `총액: ${Math.round(totalAmount)}원`;

	if (discountRate > 0) createDiscount(discountRate);

	updateStockInfo();
	renderPoints(totalAmount, $sum);
}

function applyDiscounts(totalQuantity, totalAmount, totalBeforeDiscount, day) {
	let discountRate = 0;

	if (totalQuantity >= 30) {
		// 30 개 이상이면 할인
		const TWENTYFIVE_DISCOUNT = 1 - DISCOUNT_RATE.TWENTYFIVE_PERCENT;

		const bulkDiscountAmount = totalAmount * TWENTYFIVE_DISCOUNT; // 대량 구매 시 할인 금액
		const itemDiscountTotal = totalBeforeDiscount - totalAmount; // 아이템 별 할인 후 적용 금액

		if (bulkDiscountAmount > itemDiscountTotal) {
			totalAmount = totalBeforeDiscount * (1 - TWENTYFIVE_DISCOUNT);
			discountRate = TWENTYFIVE_DISCOUNT;
		} else {
			discountRate = (totalBeforeDiscount - totalAmount) / totalBeforeDiscount;
		}
	} else {
		discountRate = (totalBeforeDiscount - totalAmount) / totalBeforeDiscount;
	}

	if (day === 2) {
		totalAmount *= DISCOUNT_RATE.TEN_PERCENT;
		discountRate = Math.max(discountRate, 0.1);
	}

	return discountRate;
}

/**
 * 재고 업데이트
 */
function updateStockInfo() {
	const $stockStatus = document.getElementById(DOM_ID.STOCK_STATUS);
	let infoMessage = PRODUCTS.filter((item) => item.quantity < STOCK_ALERT_THRESHOLDS.ALMOST_OUT)
		.map((item) =>
			item.quantity > STOCK_ALERT_THRESHOLDS.OUT_OF_STOCK
				? `${item.name}: 재고 부족 (${item.quantity})개 남음`
				: `${item.name}: 품절`,
		)
		.join('\n');

	$stockStatus.textContent = infoMessage;
}

/**
 * 포인트 section 렌더링
 */
function renderPoints(total) {
	const pointsValue = Math.floor(total / 1000);
	const $points = document.getElementById(DOM_ID.POINTS) ?? createPoints();

	$points.textContent = `(포인트: ${pointsValue})`;
}

/**
 * sale alert 이벤트
 */
export function setupSaleEvents() {
	setTimeout(function () {
		setInterval(function () {
			const luckyItem = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
			if (Math.random() < 0.3 && luckyItem.quantity > 0) {
				luckyItem.price = Math.round(luckyItem.price * DISCOUNT_RATE.TWENTY_PERCENT);
				alert20PercentSale(luckyItem.name);
				updateOptions();
			}
		}, 30000);
	}, Math.random() * 10000);

	setTimeout(function () {
		setInterval(function () {
			if (lastSelectedItem) {
				const suggestItem = PRODUCTS.find(
					(item) => item.id !== lastSelectedItem && item.quantity > 0,
				);
				if (suggestItem) {
					alert5PercentSale(suggestItem.name);
					suggestItem.price = Math.round(suggestItem.price * DISCOUNT_RATE.FIVE_PERCENT);
					updateOptions();
				}
			}
		}, 60000);
	}, Math.random() * 20000);
}

/**
 * 추가 button click handler
 */
export function handleClickAddButton() {
	const selectedId = document.getElementById(DOM_ID.SELECT_BOX).value;
	const selectedItem = PRODUCTS.find((p) => p.id === selectedId);

	if (selectedItem && selectedItem.quantity > 0) {
		const $item = document.getElementById(selectedItem.id);

		if ($item) {
			const count = getItemQuantity($item) + 1;
			if (count <= selectedItem.quantity) {
				$item.querySelector('span').textContent =
					`${selectedItem.name} - ${selectedItem.price}원 x ${count}`;
				selectedItem.quantity--;
			} else {
				alertOutOfStock(); // 재고 부족 알림
			}
		} else {
			createNewItemInCart(selectedItem);
			selectedItem.quantity--;
		}

		calculateCart();
		lastSelectedItem = selectedId;
	}
}

/**
 * 장바구나 수량 button click handler
 */
export function handleClickCart(event) {
	const $button = event.target;
	const itemId = $button.dataset.productId;
	const $selectedElement = document.getElementById(itemId);
	const selectedItem = PRODUCTS.find((product) => product.id === itemId);

	if ($button.classList.contains('quantity-change')) {
		const changeQuantity = parseInt($button.dataset.change);
		const newQuantity = getItemQuantity($selectedElement) + changeQuantity;

		if (
			newQuantity > 0 &&
			newQuantity <= selectedItem.quantity + getItemQuantity($selectedElement)
		) {
			$selectedElement.querySelector('span').textContent =
				`${$selectedElement.querySelector('span').textContent.split('x ')[0]}x ${newQuantity}`;
			selectedItem.quantity -= changeQuantity;
		} else if (newQuantity <= 0) {
			$selectedElement.remove();
			selectedItem.quantity -= changeQuantity;
		} else {
			alertOutOfStock();
		}
		calculateCart();
	} else if ($button.classList.contains('remove-item')) {
		selectedItem.quantity += getItemQuantity($selectedElement);
		$selectedElement.remove();
		calculateCart();
	}
}
