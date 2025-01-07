export const ALERT_MESSAGES = Object.freeze({
  OUT_OF_STOCK: "재고가 부족합니다.",
  SURPRISE_SALE: (itemName: string) =>
    `번개세일! ${itemName}이(가) 20% 할인 중입니다!`,
  RECOMMENDED_SALE: (itemName: string) =>
    `${itemName}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
});
