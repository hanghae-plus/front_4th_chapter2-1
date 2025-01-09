export const DISCOUNTS = {
  BULK: 0.25,
  TUESDAY: 0.1,
  PRODUCT_SPECIFIC: {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25,
  } as Record<string, number>,
};

export const UI_CLASSES = {
  CONTAINER: 'bg-gray-100 p-8',
  WRAPPER: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  HEADING: 'text-2xl font-bold mb-4',
  TOTAL: 'text-xl font-bold my-4',
  SELECT: 'border rounded p-2 mr-2',
  ADD_BUTTON: 'bg-blue-500 text-white px-4 py-2 rounded',
  STOCK_STATUS: 'text-sm text-gray-500 mt-2',
  CART_ITEM: 'flex justify-between items-center mb-2',
  QUANTITY_BUTTON: 'bg-blue-500 text-white px-2 py-1 rounded mr-1',
  REMOVE_BUTTON: 'bg-red-500 text-white px-2 py-1 rounded',
  DISCOUNT_TEXT: 'text-green-500 ml-2',
  POINTS_TEXT: 'text-blue-500 ml-2',
};

export const UI_TEXT = {
  CART_TITLE: '장바구니',
  ADD_BUTTON: '추가',
  REMOVE_BUTTON: '삭제',
  LOW_STOCK: '재고 부족',
  OUT_OF_STOCK: '품절',
  FLASH_SALE: '번개세일!',
  FLASH_SALE_MESSAGE: '이(가) 20% 할인 중입니다!',
  RECOMMEND_MESSAGE: '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
  LOW_STOCK_MESSAGE: '개 남음',
  STOCK_ERROR: '재고가 부족합니다.',
};
