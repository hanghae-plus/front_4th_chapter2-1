/**
 * 프로모션 관련 설정 상수
 * @constant {Object}
 */
const PROMOTION_CONFIG = {
  FLASH_SALE: {
    INTERVAL: 30000,
    INITIAL_DELAY: 10000,
    PROBABILITY: 0.3,
    DISCOUNT_RATE: 0.8,
  },
  RECOMMENDATION: {
    INTERVAL: 60000,
    INITIAL_DELAY: 20000,
    DISCOUNT_RATE: 0.95,
  },
};

/**
 * 상품별 기본 할인율 설정
 * @constant {Object.<string, number>}
 */
const PRODUCT_DISCOUNTS = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

/** 대량 구매 기준 수량 */
const BULK_PURCHASE_THRESHOLD = 30;
/** 대량 구매 할인율 */
const BULK_PURCHASE_DISCOUNT_RATE = 0.25;

/**
 * 상품 관리 모듈
 * 상품 목록 관리 및 재고 관리 담당
 * @namespace ProductManager
 */
const ProductManager = {
  /** @type {Array.<{id: string, name: string, price: number, stock: number}>} */
  list: [],

  /**
   * 상품 목록 초기화
   */
  initialize() {
    this.list = [
      { id: "p1", name: "상품1", price: 10000, stock: 50 },
      { id: "p2", name: "상품2", price: 20000, stock: 30 },
      { id: "p3", name: "상품3", price: 30000, stock: 20 },
      { id: "p4", name: "상품4", price: 15000, stock: 0 },
      { id: "p5", name: "상품5", price: 25000, stock: 10 },
    ];
  },

  /**
   * ID로 상품 찾기
   * @param {string} id - 상품 ID
   * @returns {Object|undefined} 찾은 상품 객체 또는 undefined
   */
  findProduct(id) {
    return this.list.find((p) => p.id === id);
  },

  /**
   * 상품 재고 업데이트
   * @param {string} id - 상품 ID
   * @param {number} quantity - 변경할 수량 (양수: 증가, 음수: 감소)
   */
  updateStock(id, quantity) {
    const product = this.findProduct(id);
    if (product) {
      product.stock += quantity;
    }
  },
};

/**
 * 할인 관리 모듈
 * 다양한 할인 정책 적용 및 계산 담당
 * @namespace DiscountManager
 */
const DiscountManager = {
  /**
   * 기본 할인율 계산
   * @param {number} subTot - 할인 전 총액
   * @param {number} totalAmount - 할인 후 총액
   * @returns {number} 할인율
   */
  calculateBaseDiscount(subTot, totalAmount) {
    return (subTot - totalAmount) / subTot;
  },

  /**
   * 대량 구매 할인 적용
   * @param {number} subTot - 할인 전 총액
   * @param {number} currentRate - 현재 할인율
   * @param {number} itemCount - 총 상품 수량
   * @returns {number} 최종 할인율
   */
  applyBulkPurchaseDiscount(subTot, currentRate, itemCount) {
    if (itemCount >= BULK_PURCHASE_THRESHOLD) {
      return Math.max(BULK_PURCHASE_DISCOUNT_RATE, currentRate);
    }
    return currentRate;
  },

  /**
   * 요일별 할인 적용 (화요일 특별 할인)
   * @param {number} currentRate - 현재 할인율
   * @returns {number} 최종 할인율
   */
  applyWeekdayDiscount(currentRate) {
    if (new Date().getDay() === 2) {
      return Math.max(currentRate, 0.1);
    }
    return currentRate;
  },

  /**
   * 전체 할인율 계산
   * @param {number} subTot - 할인 전 총액
   * @param {number} totalAmount - 할인 후 총액
   * @param {number} itemCount - 총 상품 수량
   * @returns {number} 최종 할인율
   */
  calculateDiscounts(subTot, totalAmount, itemCount) {
    let discRate = this.calculateBaseDiscount(subTot, totalAmount);
    discRate = this.applyBulkPurchaseDiscount(subTot, discRate, itemCount);
    discRate = this.applyWeekdayDiscount(discRate);
    return discRate;
  },
};

/**
 * 장바구니의 상품과 상태를 관리하는 모듈
 * @namespace CartManager
 */
const CartManager = {
  /**
   * 장바구니의 현재 상태
   * @type {Object}
   * @property {string|null} lastSelectedProduct - 마지막으로 선택된 상품 ID
   * @property {number} bonusPoints - 적립 포인트
   * @property {number} totalAmount - 총 금액
   * @property {number} itemCount - 총 상품 개수
   */
  state: {
    lastSelectedProduct: null,
    bonusPoints: 0,
    totalAmount: 0,
    itemCount: 0,
  },

  /**
   * 장바구니 아이템의 수량을 가져옴
   * @param {HTMLElement} item - 장바구니 아이템 요소
   * @returns {number} 아이템 수량
   */
  getItemQuantity(item) {
    return parseInt(item.querySelector("span").textContent.split("x ")[1]);
  },

  /**
   * 장바구니 아이템의 수량을 설정
   * @param {HTMLElement} item - 장바구니 아이템 요소
   * @param {Object} product - 상품 정보
   * @param {number} quantity - 설정할 수량
   */
  setItemQuantity(item, product, quantity) {
    item.querySelector(
      "span"
    ).textContent = `${product.name} - ${product.price}원 x ${quantity}`;
  },

  /**
   * 장바구니 아이템의 HTML 생성
   * @param {Object} product - 상품 정보
   * @param {number} [quantity=1] - 상품 수량
   * @returns {string} 생성된 HTML 문자열
   */
  createCartItemHTML({ id, name, price }, quantity = 1) {
    const buttonClass = "bg-blue-500 text-white px-2 py-1 rounded mr-1";
    const createButton = (change, text) => `
        <button class="quantity-change ${buttonClass}"
                data-product-id="${id}"
                data-change="${change}">${text}</button>
    `;

    return `
        <div id="${id}" class="flex justify-between items-center mb-2">
            <span>${name} - ${price}원 x ${quantity}</span>
            <div>
                ${createButton(-1, "-")}
                ${createButton(1, "+")}
                <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
                        data-product-id="${id}">삭제</button>
            </div>
        </div>
    `;
  },

  /**
   * 장바구니의 총액과 수량을 계산
   * @returns {Object} 계산된 총계 정보
   */
  calculateItemTotals() {
    const cartItems = Array.from(UIManager.elements.cartDisplay.children);

    // 계산 로직을 순수 함수처럼..
    const totals = cartItems.reduce(
      (acc, item) => {
        const { id, price } = ProductManager.findProduct(item.id);
        const quantity = this.getItemQuantity(item);
        const itemTotal = price * quantity;
        const discount = quantity >= 10 ? PRODUCT_DISCOUNTS[id] ?? 0 : 0;

        return {
          subTotal: acc.subTotal + itemTotal,
          totalAmount: acc.totalAmount + itemTotal * (1 - discount),
          itemCount: acc.itemCount + quantity,
        };
      },
      { subTotal: 0, totalAmount: 0, itemCount: 0 }
    );

    this.state.totalAmount = totals.totalAmount;
    this.state.itemCount = totals.itemCount;
    this.state.bonusPoints = Math.floor(totals.totalAmount / 1000);

    return totals;
  },
  
  /**
   * 장바구니 아이템의 수량을 업데이트
   * @param {HTMLElement} item - 장바구니 아이템 요소
   * @param {Object} product - 상품 정보
   * @param {number} quantityChange - 변경할 수량 (양수: 증가, 음수: 감소)
   * @returns {boolean} 업데이트 성공 여부
   */
  updateItemQuantity(item, product, quantityChange) {
    const currentQuantity = this.getItemQuantity(item);
    const newQuantity = currentQuantity + quantityChange;

    try {
      // 유효성 검사
      if (newQuantity < 0) {
        throw new Error("수량은 0보다 작을 수 없습니다.");
      }

      if (newQuantity > product.stock + currentQuantity) {
        throw new Error(`재고가 부족합니다. (현재 재고: ${product.stock}개)`);
      }

      this.setItemQuantity(item, product, newQuantity);
      ProductManager.updateStock(product.id, -quantityChange);

      return { success: true };
    } catch (error) {
      alert(error.message);

      return {
        success: false,
        error: error.message,
      };
    }
  },
};

/**
 * UI 요소들을 생성하고 관리하는 모듈
 * @namespace UIManager
 */
const UIManager = {
  /**
   * UI 요소들의 참조를 저장하는 객체
   * @type {Object.<string, HTMLElement>}
   */
  elements: {
    root: null,
    container: null,
    wrapper: null,
    productSelect: null,
    addToCartBtn: null,
    cartDisplay: null,
    totalPrice: null,
    stockStatus: null,
  },

  /**
   * DOM 요소를 생성하는 유틸리티 함수
   * @param {string} type - HTML 요소 타입
   * @param {string} [id='']
   * @param {string} [className='']
   * @param {string} [text='']
   * @returns {HTMLElement} 생성된 DOM 요소
   */
  createElement(type, id = "", className = "", text = "") {
    const element = document.createElement(type);

    if (id) element.id = id;
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  },

  /**
   * UI 초기화
   */
  initialize() {
    this.createDOMElements();
    this.constructDOMStructure();
    this.updateProductOptions();
  },

  /**
   * 필요한 모든 DOM 요소들을 생성
   */
  createDOMElements() {
    this.elements.root = document.getElementById("app");
    this.elements.container = this.createElement("div", "", "bg-gray-100 p-8");
    this.elements.wrapper = this.createElement(
      "div",
      "",
      "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8"
    );
    this.elements.headerText = this.createElement(
      "h1",
      "",
      "text-2xl font-bold mb-4",
      "장바구니"
    );
    this.elements.cartDisplay = this.createElement("div", "cart-items");
    this.elements.totalPrice = this.createElement(
      "div",
      "cart-total",
      "text-xl font-bold my-4",
      "총액: 0원(포인트: 0)"
    );
    this.elements.productSelect = this.createElement(
      "select",
      "product-select",
      "border rounded p-2 mr-2"
    );
    this.elements.addToCartBtn = this.createElement(
      "button",
      "add-to-cart",
      "bg-blue-500 text-white px-4 py-2 rounded",
      "추가"
    );
    this.elements.stockStatus = this.createElement(
      "div",
      "stock-status",
      "text-sm text-gray-500 mt-2"
    );
  },

  /**
   * 생성된 DOM 요소들을 구조화하여 페이지에 추가
   */
  constructDOMStructure() {
    const {
      wrapper,
      headerText,
      cartDisplay,
      totalPrice,
      productSelect,
      addToCartBtn,
      stockStatus,
      container,
      root,
    } = this.elements;

    wrapper.append(
      headerText,
      cartDisplay,
      totalPrice,
      productSelect,
      addToCartBtn,
      stockStatus
    );
    container.appendChild(wrapper);
    root.appendChild(container);
  },

  /**
   * 상품 선택 옵션을 업데이트
   */
  updateProductOptions() {
    const { productSelect } = this.elements;
    productSelect.innerHTML = "";

    const options = ProductManager.list.map(({ id, name, price, stock }) => {
      const option = this.createElement("option");
      Object.assign(option, {
        value: id,
        textContent: `${name} - ${price}원`,
        disabled: stock === 0,
      });
      return option;
    });

    productSelect.append(...options);
  },

  /**
   * 장바구니 표시를 업데이트
   * @param {number} discRate - 적용된 할인율
   */

  updateCartDisplay(discRate) {
    try {
      const { totalPrice } = this.elements;

      if (!totalPrice) {
        throw new Error("totalPrice 요소를 찾을 수 없습니다.");
      }

      const amount = CartManager.state.totalAmount;
      if (typeof amount !== "number") {
        throw new Error("올바른 금액이 아닙니다.");
      }

      totalPrice.textContent = `총액: ${Math.round(amount)}원`;

      if (discRate > 0) {
        const discountText = `(${(discRate * 100).toFixed(1)}% 할인 적용)`;
        const span = this.createElement(
          "span",
          "",
          "text-green-500 ml-2",
          discountText
        );
        totalPrice.appendChild(span);
      }

      return { success: true };
    } catch (error) {
      console.error("장바구니 표시 업데이트 실패:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * 재고 상태를 업데이트하여 표시
   */
  updateStockStatus() {
    const LOW_STOCK_THRESHOLD = 5;

    // 상태 텍스트 생성 로직 분리
    const stockInfo = ProductManager.list
      .filter((item) => item.stock < LOW_STOCK_THRESHOLD)
      .map(
        (item) =>
          `${item.name}: ${
            item.stock > 0 ? `재고 부족 (${item.stock}개 남음)` : "품절"
          }`
      )
      .join("\n");

    // DOM 업데이트
    this.elements.stockStatus.textContent = stockInfo;
  },

  /**
   * 보너스 포인트 정보를 렌더링
   */
  renderBonusPoints() {
    CartManager.state.bonusPoints = Math.floor(
      CartManager.state.totalAmount / 1000
    );
    let pointsTag = document.getElementById("loyalty-points");

    if (!pointsTag) {
      pointsTag = this.createElement(
        "span",
        "loyalty-points",
        "text-blue-500 ml-2"
      );
      this.elements.totalPrice.appendChild(pointsTag);
    }

    pointsTag.textContent = `(포인트: ${CartManager.state.bonusPoints})`;
  },
};

/**
 * 프로모션 관련 기능을 관리하는 모듈
 * @namespace PromotionManager
 */
const PromotionManager = {
  /**
   * 번개세일 프로모션 설정
   * 랜덤한 상품에 대해 20% 할인을 적용
   */
  setupFlashSale() {
    setTimeout(() => {
      setInterval(() => {
        const luckyItem =
          ProductManager.list[
            Math.floor(Math.random() * ProductManager.list.length)
          ];

        if (
          Math.random() < PROMOTION_CONFIG.FLASH_SALE.PROBABILITY &&
          luckyItem.stock > 0
        ) {
          luckyItem.price = Math.round(
            luckyItem.price * PROMOTION_CONFIG.FLASH_SALE.DISCOUNT_RATE
          );
          alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
          UIManager.updateProductOptions();
        }
      }, PROMOTION_CONFIG.FLASH_SALE.INTERVAL);
    }, Math.random() * PROMOTION_CONFIG.FLASH_SALE.INITIAL_DELAY);
  },

  /**
   * 추천 상품 프로모션 설정
   * 마지막으로 선택한 상품과 다른 상품을 5% 할인된 가격으로 추천
   */
  setupRecommendation() {
    setTimeout(() => {
      setInterval(() => {
        if (CartManager.state.lastSelectedProduct) {
          const suggest = ProductManager.list.find(
            (item) =>
              item.id !== CartManager.state.lastSelectedProduct &&
              item.stock > 0
          );

          if (suggest) {
            alert(
              `${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
            );
            suggest.price = Math.round(
              suggest.price * PROMOTION_CONFIG.RECOMMENDATION.DISCOUNT_RATE
            );
            UIManager.updateProductOptions();
          }
        }
      }, PROMOTION_CONFIG.RECOMMENDATION.INTERVAL);
    }, Math.random() * PROMOTION_CONFIG.RECOMMENDATION.INITIAL_DELAY);
  },

  /**
   * 모든 프로모션 기능 초기화
   */
  initialize() {
    this.setupFlashSale();
    this.setupRecommendation();
  },
};

/**
 * 이벤트 처리를 관리하는 모듈
 * @namespace EventHandler
 */
const EventHandler = {
  /**
   * 이벤트 리스너 초기화
   */
  initialize() {
    UIManager.elements.addToCartBtn.addEventListener(
      "click",
      this.handleAddToCart.bind(this)
    );
    UIManager.elements.cartDisplay.addEventListener(
      "click",
      this.handleCartAction.bind(this)
    );
  },

  /**
   * 장바구니 추가 버튼 클릭 이벤트 처리
   */
  handleAddToCart() {
    const productId = UIManager.elements.productSelect.value;
    const product = ProductManager.findProduct(productId);

    if (product && product.stock > 0) {
      const existingItem = document.getElementById(product.id);

      const success = existingItem
        ? CartManager.updateItemQuantity(existingItem, product, 1)
        : this.addNewCartItem(product);

      if (success) {
        this.processCartChanges();
        CartManager.state.lastSelectedProduct = productId;
      }
    }
  },

  // 새로운 아이템 추가 로직 분리
  addNewCartItem(product) {
    UIManager.elements.cartDisplay.insertAdjacentHTML(
      "beforeend",
      CartManager.createCartItemHTML(product)
    );
    ProductManager.updateStock(product.id, -1);
    return true;
  },

  /**
   * 장바구니 아이템 관련 이벤트 처리 (수량 변경, 삭제)
   * @param {Event} event - 클릭 이벤트 객체
   */
  handleCartAction(event) {
    const target = event.target;

    if (
      !target.classList.contains("quantity-change") &&
      !target.classList.contains("remove-item")
    ) {
      return;
    }

    const productId = target.dataset.productId;
    const item = document.getElementById(productId);
    const product = ProductManager.findProduct(productId);

    if (target.classList.contains("quantity-change")) {
      CartManager.updateItemQuantity(
        item,
        product,
        parseInt(target.dataset.change)
      );
    } else {
      const removedQuantity = CartManager.getItemQuantity(item);
      ProductManager.updateStock(product.id, removedQuantity);
      item.remove();
    }

    this.processCartChanges();
  },

  /**
   * 장바구니 변경사항 처리 (할인, 총액, 재고 상태 업데이트)
   */
  processCartChanges() {
    const totals = CartManager.calculateItemTotals();
    const discRate = DiscountManager.calculateDiscounts(
      totals.subTotal,
      CartManager.state.totalAmount,
      CartManager.state.itemCount
    );

    UIManager.updateCartDisplay(discRate);
    UIManager.updateStockStatus();
    UIManager.renderBonusPoints();
  },
};

/**
 * 애플리케이션 초기화 및 실행
 */
function main() {
  ProductManager.initialize();
  UIManager.initialize();
  PromotionManager.initialize();
  EventHandler.initialize();
}

// 앱 실행
main();
