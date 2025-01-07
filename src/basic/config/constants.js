// 주요 상수 및 초기값 설정
export const DISCOUNT_DAY = 2; // 화요일
export const BULK_DISCOUNT_RATE = 0.25; // 대량 구매 할인 비율
export const DAY_DISCOUNT_RATE = 0.1; // 화요일 할인 비율
export const BONUS_POINT_DIVISOR = 1000; // 포인트 계산 기준 (총액 / 1000)
export const SALE_CHANCE = 0.3; // 번개 세일 발생 확률
export const SALE_DISCOUNT = 0.2; // 번개 세일 할인 비율
export const SUGGEST_DISCOUNT = 0.05; // 추천 상품 할인 비율
export const LOW_STOCK_THRESHOLD = 5; // 재고 부족 기준


export const productList = [
    {id: 'p1', name: '상품1', price: 10000, quantity: 50 },
    {id: 'p2', name: '상품2', price: 20000, quantity: 30 },
    {id: 'p3', name: '상품3', price: 30000, quantity: 20 },
    {id: 'p4', name: '상품4', price: 15000, quantity: 0 },
    {id: 'p5', name: '상품5', price: 25000, quantity: 10 }
  ];
export let selectedProduct;
export let addButton;
export let cartDisplay;
export let totalDisplay;
export let stockInfo;
export let lastPickProduct;
export let bonusPoints = 0;
export let totalAmount = 0;
export let totalItems = 0;

export const root = document.getElementById("app"); // 루트 컨테이너
export const container = document.createElement("div"); // 전체 UI 컨테이너
export const wrapper = document.createElement("div"); // 카드 UI 래퍼
export const header = document.createElement("h1"); // 제목 헤더