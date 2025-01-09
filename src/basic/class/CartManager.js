import { PRODUCT_DISCOUNT, BULK_ORDER_QUANTITY, DISCOUNT_RATE } from '../constants/discount.js';
import { LOW_STOCK_WARNING_QUANTITY, PRODUCTS } from '../constants/products.js';

export default class CartManager {
  constructor() {
    this.productList = [...PRODUCTS];
    this.cartList = [];
    this.totalAmount = 0;
    this.bonusPoints = 0;
    this.lastSelectedProduct;

    this.createRootElement();
    this.initializeElements();
    this.initializeEventListeners();
    this.createProductSelectOptions();
    this.handleUpdateTotalAmount();
    this.handleUpdateStockMessage();
    this.initializePromotions();
  }

  initializeElements() {
    this.productSelectElement = document.getElementById('product-select');
    this.addToCartButtonElement = document.getElementById('add-to-cart');
    this.cartItemsElement = document.getElementById('cart-items');
    this.cartTotalElement = document.getElementById('cart-total');
    this.stockStatusElement = document.getElementById('stock-status');
  }

  initializeEventListeners() {
    this.addToCartButtonElement.addEventListener('click', () => this.handleAddToCart());
    this.cartItemsElement.addEventListener('click', (event) => this.handleCartAction(event));
  }

  initializePromotions() {
    setTimeout(() => {
      setInterval(() => this.handleRecommendedSaleAlert(), 60000);
    }, Math.random() * 20000);

    setTimeout(() => {
      setInterval(() => this.handleWowSaleAlert(), 30000);
    }, Math.random() * 10000);
  }

  handleAddToCart() {
    const productId = this.productSelectElement.value;
    const product = this.findProduct(productId);

    if (!product || !this.hasStock(product)) {
      alert('재고가 부족합니다.');
      return;
    }

    this.lastSelectedProduct = productId;

    this.handleAddItemToCart(product);
    this.handleUpdateStock(product.id, -1);
    this.renderCart();
    this.handleUpdateTotalAmount();
    this.handleUpdateStockMessage();
  }

  handleCartAction(event) {
    const target = event.target;

    // 수량 변경이나 삭제 버튼이 아닌 경우 무시
    if (
      !target.classList.contains('quantity-change') &&
      !target.classList.contains('remove-item')
    ) {
      return;
    }

    const productId = target.dataset.productId;
    const product = this.findProduct(productId);
    const cartItem = this.cartList.find((item) => item.productId === productId);
    const itemElement = document.getElementById(productId);

    if (target.classList.contains('quantity-change')) {
      const quantityChange = parseInt(target.dataset.change);
      const currentQuantity = parseInt(
        itemElement.querySelector('span').textContent.split('x ')[1],
      );
      const newQuantity = currentQuantity + quantityChange;

      // 수량이 0 이하가 되는 경우
      if (newQuantity <= 0) {
        this.cartList = this.cartList.filter((item) => item.productId !== productId);
        product.stockQuantity += currentQuantity;
        itemElement.remove();
      }
      // 재고보다 많은 수량을 요청
      else if (newQuantity > product.stockQuantity + currentQuantity) {
        alert('재고가 부족합니다.');
        return;
      }
      // 정상적인 수량 변경
      else {
        cartItem.quantity = newQuantity;
        product.stockQuantity -= quantityChange;
        itemElement.querySelector(
          'span',
        ).textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
      }
    }
    // 상품을 삭제하는 경우
    else if (target.classList.contains('remove-item')) {
      const currentQuantity = parseInt(
        itemElement.querySelector('span').textContent.split('x ')[1],
      );
      this.cartList = this.cartList.filter((item) => item.productId !== productId);
      product.stockQuantity += currentQuantity;
      itemElement.remove();
    }

    this.handleUpdateTotalAmount();
    this.handleUpdateStockMessage();
  }

  handleAddItemToCart(product) {
    const cartItem = this.cartList.find((item) => item.productId === product.id);

    if (cartItem) {
      cartItem.quantity++;
    } else {
      this.cartList.push({ productId: product.id, quantity: 1 });
    }
  }

  findProduct(productId) {
    return this.productList.find((product) => product.id === productId);
  }

  hasStock(product) {
    return product.stockQuantity > 0;
  }

  handleUpdateStock(productId, change) {
    const product = this.findProduct(productId);

    if (product) {
      product.stockQuantity += change;
    }
  }

  handleUpdateStockMessage() {
    this.productList.forEach((product) => {
      if (product.stockQuantity < LOW_STOCK_WARNING_QUANTITY) {
        this.stockStatusElement.textContent = `${product.name}: ${
          product.stockQuantity > 0 ? `재고 부족 (${product.stockQuantity}개 남음)` : '품절'
        }`;
      }
    });
  }

  handleUpdateTotalAmount() {
    const subTotal = this.calculateSubTotal();
    const weekDiscount = this.calculateWeekDiscount();
    const bulkDiscount = this.calculateBulkDiscount();

    this.totalAmount = 0;

    this.cartList.forEach((item) => {
      const product = this.findProduct(item.productId);
      const itemTotal = product.price * item.quantity;

      // 개별 상품 할인 적용
      if (item.quantity >= PRODUCT_DISCOUNT[item.productId]?.minQuantity) {
        this.totalAmount += itemTotal * (1 - PRODUCT_DISCOUNT[item.productId].rate);
      } else {
        this.totalAmount += itemTotal;
      }
    });

    const finalDiscountRate =
      Math.max(weekDiscount, bulkDiscount, (subTotal - this.totalAmount) / subTotal || 0) * 100;

    this.cartTotalElement.textContent = '';

    const totalAmountSpanElement = document.createElement('span');
    totalAmountSpanElement.textContent = `총액: ${Math.round(this.totalAmount)}원`;
    this.cartTotalElement.appendChild(totalAmountSpanElement);

    //할인율 표시
    if (finalDiscountRate > 0) {
      const discountSpanElement = document.createElement('span');
      discountSpanElement.className = 'text-blue-500 ml-2';
      discountSpanElement.textContent = `(${finalDiscountRate.toFixed(1)}% 할인 적용)`;
      this.cartTotalElement.appendChild(discountSpanElement);
    }

    this.handleUpdateBonusPoints();
  }

  handleUpdateBonusPoints() {
    const pointPerWon = 1000;
    const newPoints = Math.floor(this.totalAmount / pointPerWon);
    this.bonusPoints = newPoints;

    let pointsElement = document.getElementById('loyalty-points');

    if (!pointsElement) {
      pointsElement = document.createElement('span');
      pointsElement.id = 'loyalty-points';
      pointsElement.className = 'text-blue-500 ml-2';
      this.cartTotalElement.appendChild(pointsElement);
    }

    pointsElement.textContent = `(포인트: ${this.bonusPoints})`;
  }

  renderCart() {
    this.cartItemsElement.innerHTML = '';
    this.cartList.forEach((item) => {
      const product = this.findProduct(item.productId);
      const itemElement = this.createCartItemElement(product, item);
      this.cartItemsElement.appendChild(itemElement);
    });
  }

  calculateSubTotal() {
    return this.cartList.reduce((total, item) => {
      const product = this.findProduct(item.productId);
      return total + product.price * item.quantity;
    }, 0);
  }

  calculateItemDiscount() {
    let maxDiscountRate = 0;

    this.cartList.forEach((item) => {
      const product = this.findProduct(item.productId);
      const productDiscount = PRODUCT_DISCOUNT[product.id];

      if (productDiscount && this.cartItemsElement.quantity >= productDiscount.minQuantity) {
        maxDiscountRate = Math.max(maxDiscountRate, productDiscount.rate);
      }
    });

    return maxDiscountRate;
  }

  //대량 구매 할인 ( 30개 이상 )
  calculateBulkDiscount() {
    const totalQuantity = this.cartList.reduce((total, item) => total + item.quantity, 0);

    return totalQuantity >= BULK_ORDER_QUANTITY ? DISCOUNT_RATE.BULK_DISCOUNT : 0;
  }

  calculateWeekDiscount() {
    if (this.cartList.length === 0) {
      return 0;
    }

    const today = new Date();
    const day = today.getDay();

    if (DISCOUNT_RATE[`WEEK_DISCOUNT_${day}`]) {
      return DISCOUNT_RATE[`WEEK_DISCOUNT_${day}`];
    }
    return 0;
  }

  calculateIndividualDiscount() {
    let maxDiscountRate = 0;

    this.cartList.forEach((item) => {
      const quantity = item.quantity;

      if (quantity >= PRODUCT_DISCOUNT[item.productId].minQuantity) {
        maxDiscountRate = Math.max(maxDiscountRate, PRODUCT_DISCOUNT[item.productId].rate);
      }
    });

    return maxDiscountRate;
  }

  calculateAllDiscountRate() {
    const individualDiscount = this.calculateIndividualDiscount();
    const tuesdayDiscount = this.calculateWeekDiscount();
    const bulkDiscount = this.calculateBulkDiscount();

    return Math.max(individualDiscount, tuesdayDiscount, bulkDiscount);
  }

  createProductSelectOptions() {
    this.productSelectElement.innerHTML = '';

    this.productList.forEach((product) => {
      const optionElement = document.createElement('option');

      optionElement.value = product.id;
      optionElement.textContent = `${product.name} - ${product.price}원`;
      optionElement.disabled = product.stockQuantity === 0;

      this.productSelectElement.appendChild(optionElement);
    });
  }

  createCartItemElement(product, item) {
    const divElement = document.createElement('div');
    divElement.id = product.id;
    divElement.className = 'flex justify-between items-center mb-2';
    divElement.innerHTML = `<span>${product.name} - ${product.price}원 x ${item.quantity}</span><div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
      </div>`;

    return divElement;
  }

  createRootElement() {
    const rootElement = document.getElementById('app');

    const containerElement = document.createElement('div');
    containerElement.className = 'bg-gray-100 p-8';

    containerElement.innerHTML = `
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4">총액: 0원</div>
        <select id="product-select" class="border rounded p-2 mr-2"></select>
        <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
        <div id="stock-status" class="text-sm text-gray-500 mt-2"></div>
      </div>
    `;

    rootElement.appendChild(containerElement);
  }

  handleRecommendedSaleAlert() {
    if (!this.lastSelectedProduct) return;

    const recommendedProduct = this.productList.find(
      (product) => product.id !== this.lastSelectedProduct && product.stockQuantity > 0,
    );

    if (recommendedProduct) {
      recommendedProduct.price = Math.round(recommendedProduct.price * 0.95);
      alert(`${recommendedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
      this.createProductSelectOptions();
    }
  }

  handleWowSaleAlert() {
    const randomProduct = this.productList[Math.floor(Math.random() * this.productList.length)];

    if (Math.random() < 0.3 && randomProduct.stockQuantity > 0) {
      randomProduct.price = Math.round(randomProduct.price * 0.8);
      alert(`번개세일! ${randomProduct.name}이(가) 20%할인 중입니다!`);
      this.createProductSelectOptions();
    }
  }
}
