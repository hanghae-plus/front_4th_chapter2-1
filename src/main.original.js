/**
 * 상수 정의 - 보존
 */
const PRODUCT_DISCOUNTS = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

// 기존 상수들 유지
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

  applyWeekdayDiscount(currentRate) {
    return new Date().getDay() === 2 ? Math.max(0.1, currentRate) : currentRate;
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
        if (new Date().getDay() === 2) {
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
    // 할인 전 금액의 1%를 포인트로 적립
    this.state.bonusPoints = Math.floor(result.subTotal / 100);

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

  updateProductSelect() {
    const select = this.elements.productSelect;
    select.innerHTML = ProductManager.availableProducts
      .map(
        (product) =>
          `<option value="${product.id}"${
            product.stock <= 0 ? " disabled" : ""
          }>${product.name} - ${product.price}원</option>`
      )
      .join("");
  },

  updateStockDisplay() {
    this.elements.stockStatus.innerHTML = ProductManager.availableProducts
      .map(
        (product) =>
          `${product.name}: ${
            product.stock > 0 ? `${product.stock}개` : "품절"
          }`
      )
      .join("<br>");
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
        CartManager.state.lastSelectedProduct = productId; // 마지막 선택 상품 업데이트
      }
    }
  },

  handleCartAction(event) {
    const target = event.target;
    if (target.classList.contains("quantity-change")) {
      const item = target.closest(".cart-item");
      const change = parseInt(target.dataset.change);
      EventHandler.handleQuantityChange(item, change);
    } else if (target.classList.contains("remove-item")) {
      const item = target.closest(".cart-item");
      EventHandler.handleRemoveItem(item);
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
    const points = Math.floor(totals.totalAmount / 1000); // 0.1% 포인트 계산

    console.log("totals.totalAmount", totals.totalAmount);
    console.log("totals.totalAmount?", Math.round(totals.totalAmount));
    console.log(points);

    let displayText = `총액: ${Math.round(totals.totalAmount)}원`;
    if (totals.discount > 0) {
      displayText += `(${(totals.discount * 100).toFixed(1)}% 할인 적용)`;
    }
    displayText += `(포인트: ${points})`;

    DOMManager.elements.cartTotal.textContent = displayText;
    DOMManager.elements.loyaltyPoints.textContent = `(포인트: ${points})`;
    DOMManager.updateStockDisplay();
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
  // 먼저 ProductManager 초기화
  ProductManager.initialize();

  // DOM이 모두 로드된 후 실행
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
