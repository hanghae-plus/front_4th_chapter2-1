/**
 * 상수 정의
 */
const PRODUCT_DISCOUNTS = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

const BULK_PURCHASE_THRESHOLD = 30;
const BULK_PURCHASE_DISCOUNT_RATE = 0.25;
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
 * 비즈니스 로직: 상품 관리
 */
const ProductManager = {
  availableProducts: [],

  initialize() {
    this.availableProducts = [
      { id: "p1", name: "상품1", price: 10000, stock: 50 },
      { id: "p2", name: "상품2", price: 20000, stock: 30 },
      { id: "p3", name: "상품3", price: 30000, stock: 20 },
      { id: "p4", name: "상품4", price: 15000, stock: 0 },
      { id: "p5", name: "상품5", price: 25000, stock: 10 },
    ];
  },

  findProduct(id) {
    return this.availableProducts.find((p) => p.id === id);
  },

  updateStock(id, change) {
    const product = this.findProduct(id);
    if (!product) return false;

    const newStock = product.stock + change;
    if (newStock < 0) return false;

    product.stock = newStock;
    return true;
  },
};

/**
 * 비즈니스 로직: 할인 관리
 */
const DiscountManager = {
  calculateBaseDiscount(subTotal, totalAmount) {
    return subTotal !== 0 ? (subTotal - totalAmount) / subTotal : 0;
  },

  applyBulkPurchaseDiscount(currentRate, itemCount) {
    return itemCount >= BULK_PURCHASE_THRESHOLD
      ? Math.max(BULK_PURCHASE_DISCOUNT_RATE, currentRate)
      : currentRate;
  },

  getCurrentDay() {
    return new Date().getDay();
  },

  applyWeekdayDiscount(currentRate) {
    return this.getCurrentDay() === 2
      ? Math.max(0.1, currentRate)
      : currentRate;
  },

  calculateTotalDiscount(subTotal, totalAmount, itemCount) {
    let rate = this.calculateBaseDiscount(subTotal, totalAmount);
    rate = this.applyBulkPurchaseDiscount(rate, itemCount);
    rate = this.applyWeekdayDiscount(rate);
    return rate;
  },
};

/**
 * 비즈니스 로직: 장바구니 관리
 */
const CartManager = {
  state: {
    lastSelectedProduct: null,
    bonusPoints: 0,
    itemCount: 0,
  },

  calculateTotals(items) {
    const result = items.reduce(
      (acc, { id, quantity }) => {
        const product = ProductManager.findProduct(id);
        if (!product) return acc;

        const itemTotal = product.price * quantity;
        let discount = 0;

        // 수량 할인 (10개 이상)
        if (quantity >= 10) {
          discount = Math.max(discount, PRODUCT_DISCOUNTS[id] || 0);
        }

        // 화요일 할인 (10%)
        if (DiscountManager.getCurrentDay() === 2) {
          discount = Math.max(discount, 0.1);
        }

        const discountedTotal = itemTotal * (1 - discount);

        return {
          subTotal: acc.subTotal + itemTotal,
          totalAmount: acc.totalAmount + discountedTotal,
          itemCount: acc.itemCount + quantity,
          discount: discount > 0 ? discount : acc.discount,
        };
      },
      { subTotal: 0, totalAmount: 0, itemCount: 0, discount: 0 }
    );

    this.state.itemCount = result.itemCount;
    this.state.bonusPoints = Math.floor(result.subTotal / 1000);

    return result;
  },
};

/**
 * UI 로직: DOM 관리
 */
const DOMManager = {
  elements: {
    root: null,
    productSelect: null,
    addToCartBtn: null,
    cartItems: null,
    cartTotal: null,
    loyaltyPoints: null,
    stockStatus: null,
  },

  // 재고 상태 캐시 추가
  _stockCache: new Map(),

  initialize() {
    // 기본 HTML 구조 생성
    document.getElementById("app").innerHTML = `
      <h1>장바구니</h1>
      <select id="product-select"></select>
      <button id="add-to-cart">추가</button>
      <div id="cart-items"></div>
      <div id="cart-total">총액: 0원(포인트: 0)</div>
      <div id="loyalty-points">(포인트: 0)</div>
      <div id="stock-status"></div>
    `;

    // DOM 요소 참조 저장 후 초기화
    this.initializeElements();
    this.updateProductSelect();
    this.updateStockDisplay();
  },

  initializeElements() {
    this.elements = {
      root: document.getElementById("app"),
      productSelect: document.getElementById("product-select"),
      addToCartBtn: document.getElementById("add-to-cart"),
      cartItems: document.getElementById("cart-items"),
      cartTotal: document.getElementById("cart-total"),
      loyaltyPoints: document.getElementById("loyalty-points"),
      stockStatus: document.getElementById("stock-status"),
    };
  },

  // 상품 선택 목록 업데이트 최적화
  updateProductSelect() {
    const select = this.elements.productSelect;
    if (!select) return;

    const fragment = document.createDocumentFragment();

    ProductManager.availableProducts.forEach((product) => {
      const option = document.createElement("option");
      option.value = product.id;
      option.textContent = `${product.name} - ${product.price}원`;
      option.disabled = product.stock <= 0;
      fragment.appendChild(option);
    });

    // 기존 옵션을 한 번에 교체
    select.innerHTML = "";
    select.appendChild(fragment);
  },

  // 전체 재고 상태 표시 최적화
  updateStockDisplay() {
    const fragment = document.createDocumentFragment();
    const stockContainer = this.elements.stockStatus;

    ProductManager.availableProducts.forEach((product) => {
      const stockText = product.stock > 0 ? `${product.stock}개` : "품절";
      const div = document.createElement("div");
      div.setAttribute("data-product-id", product.id);
      div.textContent = `${product.name}: ${stockText}`;
      fragment.appendChild(div);

      // 캐시 업데이트
      this._stockCache.set(product.id, product.stock);
    });

    // 기존 내용을 한 번에 교체
    stockContainer.innerHTML = "";
    stockContainer.appendChild(fragment);
  },

  // 개별 상품 재고 업데이트
  updateProductStock(productId) {
    const product = ProductManager.findProduct(productId);
    if (!product) return;

    // 캐시된 재고 상태와 비교해서 없으면 스킵하도록
    const cachedStock = this._stockCache.get(productId);
    if (cachedStock === product.stock) return; 

    const stockElement = this.elements.stockStatus.querySelector(
      `[data-product-id="${productId}"]`
    );

    if (stockElement) {
      const stockText = product.stock > 0 ? `${product.stock}개` : "품절";
      if (stockElement.lastStockText !== stockText) {
        stockElement.textContent = `${product.name}: ${stockText}`;
        stockElement.lastStockText = stockText;
        this._stockCache.set(productId, product.stock);
      }
    }
  },

  createCartItem(product, quantity = 1) {
    return `
      <div id="${product.id}" class="cart-item">
        <span>${product.name} - ${product.price}원 x ${quantity}</span>
        <div>
          <button class="quantity-change" data-product-id="${product.id}" data-change="-1">-</button>
          <button class="quantity-change" data-product-id="${product.id}" data-change="1">+</button>
          <button class="remove-item" data-product-id="${product.id}">삭제</button>
        </div>
      </div>
    `;
  },
};

/**
 * UI 로직: 이벤트 처리
 */
const EventHandler = {
  initialize() {
    DOMManager.elements.addToCartBtn.addEventListener("click", () =>
      this.handleAddToCart()
    );
    DOMManager.elements.cartItems.addEventListener("click", (e) =>
      this.handleCartAction(e)
    );
  },

  handleAddToCart() {
    const productId = DOMManager.elements.productSelect.value;
    const product = ProductManager.findProduct(productId);

    if (!product || product.stock <= 0) return;

    const existingItem = document.getElementById(productId);
    if (existingItem) {
      this.handleQuantityChange(existingItem, 1);
    } else {
      if (ProductManager.updateStock(productId, -1)) {
        DOMManager.elements.cartItems.insertAdjacentHTML(
          "beforeend",
          DOMManager.createCartItem(product)
        );
        this.updateDisplays();
        CartManager.state.lastSelectedProduct = productId;
      }
    }
  },

  handleCartAction(event) {
    const target = event.target;
    if (target.classList.contains("quantity-change")) {
      const item = target.closest(".cart-item");
      const change = parseInt(target.dataset.change);
      this.handleQuantityChange(item, change);
    } else if (target.classList.contains("remove-item")) {
      const item = target.closest(".cart-item");
      this.handleRemoveItem(item);
    }
  },

  handleQuantityChange(item, change) {
    const productId = item.id;
    const product = ProductManager.findProduct(productId);
    const currentQuantity = parseInt(
      item.querySelector("span").textContent.split("x ")[1]
    );
    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {
      this.handleRemoveItem(item);
      return;
    }

    if (ProductManager.updateStock(productId, -change)) {
      item.querySelector(
        "span"
      ).textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
      this.updateDisplays();
    } else {
      alert("재고가 부족합니다.");
    }
  },

  handleRemoveItem(item) {
    const productId = item.id;
    const quantity = parseInt(
      item.querySelector("span").textContent.split("x ")[1]
    );
    ProductManager.updateStock(productId, quantity);
    item.remove();
    this.updateDisplays();
  },

  updateDisplays() {
    const cartItems = Array.from(DOMManager.elements.cartItems.children).map(
      (item) => ({
        id: item.id,
        quantity: parseInt(
          item.querySelector("span").textContent.split("x ")[1]
        ),
      })
    );

    const totals = CartManager.calculateTotals(cartItems);
    const points = Math.floor(totals.totalAmount / 1000);

    let displayText = `총액: ${Math.round(totals.totalAmount)}원`;
    if (totals.discount > 0) {
      displayText += `(${(totals.discount * 100).toFixed(1)}% 할인 적용)`;
    }
    displayText += `(포인트: ${points})`;

    DOMManager.elements.cartTotal.textContent = displayText;
    DOMManager.elements.loyaltyPoints.textContent = `(포인트: ${points})`;
    DOMManager.updateProductStock(CartManager.state.lastSelectedProduct);
  },
};

/**
 * 프로모션 관리
 */
const PromotionManager = {
  initialize() {
    this.setupFlashSale();
    this.setupRecommendation();
  },

  // 번개세일 프로모션
  setupFlashSale() {
    const config = PROMOTION_CONFIG.FLASH_SALE;
    setTimeout(() => {
      setInterval(() => {
        if (Math.random() < config.PROBABILITY) {
          const products = ProductManager.availableProducts.filter(
            (p) => p.stock > 0
          );
          const product = products[Math.floor(Math.random() * products.length)];
          if (product) {
            product.price = Math.round(product.price * config.DISCOUNT_RATE);
            alert(`번개세일! ${product.name}이(가) 20% 할인 중입니다!`);
            DOMManager.updateProductSelect();
          }
        }
      }, config.INTERVAL);
    }, config.INITIAL_DELAY);
  },

  // 추천 프로모션
  setupRecommendation() {
    const config = PROMOTION_CONFIG.RECOMMENDATION;
    setTimeout(() => {
      setInterval(() => {
        if (CartManager.state.lastSelectedProduct) {
          const products = ProductManager.availableProducts.filter(
            (p) => p.id !== CartManager.state.lastSelectedProduct && p.stock > 0
          );
          const product = products[Math.floor(Math.random() * products.length)];
          if (product) {
            product.price = Math.round(product.price * config.DISCOUNT_RATE);
            alert(
              `${product.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
            );
            DOMManager.updateProductSelect();
          }
        }
      }, config.INTERVAL);
    }, config.INITIAL_DELAY);
  },
};

// 애플리케이션 초기화
function main() {
  ProductManager.initialize();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      DOMManager.initialize();
      EventHandler.initialize();
      PromotionManager.initialize();
    });
  } else {
    DOMManager.initialize();
    EventHandler.initialize();
    PromotionManager.initialize();
  }
}

// 앱 실행
main();
