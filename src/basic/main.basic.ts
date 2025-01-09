

import { productList, SALE_PROBABILITY } from './constant/product';
import { CartWithElements } from './interface/cart';
import { cartService } from './utils/cart-util';
import { createChildElement, createStyledElement } from './utils/element-util';
import { startDelayedInterval } from './utils/interval-util';

const { calculateCartTotal, updateCartTotal, addCartProduct } = cartService();

function initializeShoppingCart() {
  const cart: CartWithElements = {
    productSelect: null,
    addCartBtn: null,
    cartDisplay: null,
    cartTotalPrice: null,
    stockStatus: null,
    bonusPoints: 0,
    totalAmt: 0,
    itemCnt: 0,
  };

  renderCartUI(cart);
  updateProductOptions(cart);
  calculateCartTotal(cart);
  startDelayedInterval(() => handleLuckyItemSale(cart), 30000, 10000);
  startDelayedInterval(() => handleProductSuggestions(), 60000, 20000);

  setupEventListeners(cart);
}

// UI 렌더링 함수
function renderCartUI(cart: CartWithElements) {
  const root = document.getElementById('app');
  const contents = createStyledElement({
    tag: 'div',
    className: 'bg-gray-100 p-8',
  });
  const cartSection = createStyledElement({
    tag: 'div',
    className:
      'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });
  const headerText = createStyledElement({
    tag: 'h1',
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });

  cart.cartDisplay = createStyledElement({
    tag: 'div',
    id: 'cart-items',
  });
  cart.cartTotalPrice = createStyledElement({
    tag: 'div',
    id: 'cart-total',
    className: 'text-xl font-bold my-4',
  });
  cart.productSelect = createStyledElement({
    tag: 'select',
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });
  cart.addCartBtn = createStyledElement({
    tag: 'button',
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
  });
  cart.stockStatus = createStyledElement({
    tag: 'div',
    id: 'stock-status',
    className: 'text-sm text-gray-500 mt-2',
  });

  const cartElements = [
    { parent: cartSection, child: headerText },
    { parent: cartSection, child: cart.cartDisplay },
    { parent: cartSection, child: cart.cartTotalPrice },
    { parent: cartSection, child: cart.productSelect },
    { parent: cartSection, child: cart.addCartBtn },
    { parent: cartSection, child: cart.stockStatus },
    { parent: contents, child: cartSection },
    { parent: root, child: contents },
  ];

  cartElements.forEach(({ parent, child }) =>
    createChildElement(parent!, child)
  );
}

// 상품 선택 옵션 업데이트 함수
function updateProductOptions(cart: CartWithElements) {
  if (cart.productSelect) {
    cart.productSelect.innerHTML = '';
    productList.forEach(function (product) {
      const productOption = createStyledElement({
        tag: 'option',
        value: product.id,
        textContent: `${product.name} - ${product.price}원`,
      });

      if (product.qty === 0) productOption.disabled = true;
      createChildElement(cart.productSelect!, productOption);
    });
  }
}

// 상품 선택 후 장바구니에 추가하는 이벤트 처리 함수
function handleAddCartProduct(cart: CartWithElements) {
  const selectedProductId = cart.productSelect ? cart.productSelect.value : '';
  const addProduct = productList.find(
    (product) => product.id === selectedProductId
  );

  if (addProduct && addProduct.qty > 0) {
    addCartProduct(cart, addProduct);
    calculateCartTotal(cart);
  } else {
    alert('재고가 부족합니다.');
  }
}

// 행운 상품 처리 함수
function handleLuckyItemSale(cart: CartWithElements) {
  const luckyProduct = productList.find(
    (product) => product.price > Math.random()
  );
  if (luckyProduct) {
    alert(`${luckyProduct.name}이(가) 행운 상품으로 할인되었습니다!`);
    luckyProduct.price = luckyProduct.price * (1 - SALE_PROBABILITY);
    updateCartTotal(cart);
  }
}

// 추천 상품 처리 함수
function handleProductSuggestions() {
  const suggestedProduct =
    productList[Math.floor(Math.random() * productList.length)];
  alert(`${suggestedProduct.name}을 추천합니다!`);
}

// 이벤트 등록 함수
function setupEventListeners(cart: CartWithElements) {
  if (cart.addCartBtn) {
    cart.addCartBtn.addEventListener('click', function () {
      handleAddCartProduct(cart);
    });
  }

  if (cart.cartDisplay) {
    cart.cartDisplay.addEventListener('click', function (event) {
      const target = event.target as HTMLElement;

      if (target.classList.contains('remove-item')) {
        const productId = target.dataset.productId;
        console.log(productId);
        if (productId) {
          const productIndex = cart.cartDisplay!.querySelector(`#${productId}`);
          if (productIndex) {
            cart.cartDisplay!.removeChild(productIndex);
            productList.forEach((product) => {
              if (product.id === productId) product.qty++;
            });
            calculateCartTotal(cart);
          }
        }
      }

      if (target.classList.contains('quantity-change')) {
        const productId = target.dataset.productId;
        const change = parseInt(target.dataset.change || '0');
        const product = productList.find((product) => product.id === productId);

        if (product) {
          const productIndex = cart.cartDisplay!.querySelector(`#${productId}`);
          if (productIndex) {
            const qtyElement = productIndex.querySelector('span');
            if (qtyElement) {
              const qty = parseInt(
                qtyElement.textContent?.split('x ')[1] || '0'
              );

              if (qty + change <= product.qty + qty) {
                qtyElement.textContent = `${product.name} - ${product.price}원 x ${qty + change}`;
                product.qty -= change;
                calculateCartTotal(cart);
              } else {
                alert('재고가 부족합니다.');
              }
            }
          }
        }
      }
    });
  }
}

initializeShoppingCart();

