import { DOM_ID } from './constants';
import { createLayout } from './ui';
import {
	updateOptions,
	calculateCart,
	handleClickAddButton,
	handleClickCart,
	setupSaleEvents,
} from './models';

function main() {
	createLayout(); // 1. ui 생성
	updateOptions(); // 2. option 초기화
	calculateCart();
	setupSaleEvents();
}

main();

document.getElementById(DOM_ID.ADD_BUTTON).addEventListener('click', handleClickAddButton);
document.getElementById(DOM_ID.CART_CONTAINER).addEventListener('click', handleClickCart);
