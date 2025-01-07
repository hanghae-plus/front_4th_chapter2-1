import { PRODUCT_LIST } from '../data/productData';

// 번개세일 alert
const eventDiscountLucky = () => {
	setTimeout(function () {
		setInterval(function () {
			var luckyItem =
				PRODUCT_LIST[Math.floor(Math.random() * PRODUCT_LIST.length)];
			if (Math.random() < 0.3 && luckyItem.q > 0) {
				luckyItem.val = Math.round(luckyItem.val * 0.8);
				alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
				updateProductOptions();
			}
		}, 30000);
	}, Math.random() * 10000);
};

// 추천세일 alert
const eventDiscountSuggest = (lastSel) => {
	setTimeout(function () {
		setInterval(function () {
			if (lastSel) {
				var suggest = PRODUCT_LIST.find(function (item) {
					return item.id !== lastSel && item.q > 0;
				});
				if (suggest) {
					alert(
						suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
					);
					suggest.val = Math.round(suggest.val * 0.95);
					updateProductOptions();
				}
			}
		}, 60000);
	}, Math.random() * 20000);
};


export {
	eventDiscountLucky,
	eventDiscountSuggest,
};