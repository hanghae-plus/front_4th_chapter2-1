import { OUT_OF_STOCK_MSG } from './constants';
import { utils } from './utils';

const productList = [
  { id: 'p1', name: '상품1', price: 10000, stock: 50 },
  { id: 'p2', name: '상품2', price: 20000, stock: 30 },
  { id: 'p3', name: '상품3', price: 30000, stock: 20 },
  { id: 'p4', name: '상품4', price: 15000, stock: 0 },
  { id: 'p5', name: '상품5', price: 25000, stock: 10 },
];
const _utils = utils();
let lastAddCartProductId,
  totalAmt = 0;

const ElementProductSelect = document.createElement('select');
const ElementAddCartBtn = document.createElement('button');
const ElementCartItems = document.createElement('div');
const ElementTotalPrice = document.createElement('div');
const ElementStockStatus = document.createElement('div');

function main() {
  calcCart();

  renderCart();

  renderProductSelectOptions();

  alertLuckySale();

  alertSuggestProduct();
}

const alertLuckySale = () => {
  // 번개 세일 alert 함수
  setTimeout(function () {
    setInterval(function () {
      const luckyProduct = productList[_utils.randomIndex(productList.length)];
      if (Math.random() < 0.3 && luckyProduct.stock > 0) {
        luckyProduct.price = Math.round(luckyProduct.price * 0.8);
        alert(`번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
        renderProductSelectOptions();
      }
    }, 30000);
  }, Math.random() * 10000);
};

const alertSuggestProduct = () => {
  // 상품 추천 함수
  setTimeout(function () {
    setInterval(function () {
      if (lastAddCartProductId) {
        const suggest = productList.find(function (product) {
          return product.id !== lastAddCartProductId && product.stock > 0;
        });
        if (suggest) {
          alert(
            `${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
          );
          suggest.price = Math.round(suggest.price * 0.95);
          renderProductSelectOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};

const renderCart = () => {
  const root = document.getElementById('app');
  const cont = document.createElement('div');
  const wrap = document.createElement('div');
  const hTxt = document.createElement('h1');

  cont.className = 'bg-gray-100 p-8';
  wrap.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  hTxt.className = 'text-2xl font-bold mb-4';
  hTxt.textContent = '장바구니';
  ElementCartItems.id = 'cart-items';
  ElementTotalPrice.id = 'cart-total';
  ElementProductSelect.id = 'product-select';
  ElementAddCartBtn.id = 'add-to-cart';
  ElementStockStatus.id = 'stock-status';
  ElementTotalPrice.className = 'text-xl font-bold my-4';
  ElementProductSelect.className = 'border rounded p-2 mr-2';
  ElementAddCartBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  ElementStockStatus.className = 'text-sm text-gray-500 mt-2';
  ElementAddCartBtn.textContent = '추가';

  wrap.appendChild(hTxt);
  wrap.appendChild(ElementCartItems);
  wrap.appendChild(ElementTotalPrice);
  wrap.appendChild(ElementProductSelect);
  wrap.appendChild(ElementAddCartBtn);
  wrap.appendChild(ElementStockStatus);
  cont.appendChild(wrap);
  root.appendChild(cont);
};

const renderProductSelectOptions = () => {
  ElementProductSelect.innerHTML = '';

  productList.forEach(function (item) {
    const ElementProductSelectOption = document.createElement('option');
    ElementProductSelectOption.value = item.id;
    ElementProductSelectOption.textContent = `${item.name} - ${item.price}원`;
    if (item.stock === 0) ElementProductSelectOption.disabled = true;
    ElementProductSelect.appendChild(ElementProductSelectOption);
  });
};

const renderLoyaltyPoints = () => {
  const loyaltyPoints = Math.floor(totalAmt / 1000);
  let ElementLoyaltyPoints = document.getElementById('loyalty-points');

  if (!ElementLoyaltyPoints) {
    ElementLoyaltyPoints = document.createElement('span');
    ElementLoyaltyPoints.id = 'loyalty-points';
    ElementLoyaltyPoints.className = 'text-blue-500 ml-2';
    ElementTotalPrice.appendChild(ElementLoyaltyPoints);
  }

  ElementLoyaltyPoints.textContent = `(포인트: ${loyaltyPoints})`;
};

const renderStockInfo = () => {
  let infoMsg = '';

  productList.forEach(function (item) {
    if (item.stock < 5) {
      infoMsg += `${item.name}: ${
        item.stock > 0 ? `재고 부족 (${item.stock}개 남음)` : '품절'
      }\n`;
    }
  });

  ElementStockStatus.textContent = infoMsg;
};

const calcCart = () => {
  totalAmt = 0;
  const cartItems = ElementCartItems.children;
  let totalCnt = 0;
  let subTot = 0;
  let discountRate = 0;

  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let currentProduct;
      let discount = 0;
      const cnt = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1]
      );

      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          currentProduct = productList[j];
          break;
        }
      }

      const itemTot = currentProduct.price * cnt;

      if (cnt >= 10) {
        if (currentProduct.id === 'p1') discount = 0.1;
        else if (currentProduct.id === 'p2') discount = 0.15;
        else if (currentProduct.id === 'p3') discount = 0.2;
        else if (currentProduct.id === 'p4') discount = 0.05;
        else if (currentProduct.id === 'p5') discount = 0.25;
      }

      totalCnt += cnt;
      subTot += itemTot;
      totalAmt += itemTot * (1 - discount);
    })();
  }

  if (totalCnt >= 30) {
    const bulkDiscount = totalAmt * 0.25;
    const itemDiscount = subTot - totalAmt;

    if (bulkDiscount > itemDiscount) {
      totalAmt = subTot * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subTot - totalAmt) / subTot;
    }
  } else {
    discountRate = (subTot - totalAmt) / subTot;
  }

  if (new Date().getDay() === 2) {
    totalAmt *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  ElementTotalPrice.textContent = `총액: ${Math.round(totalAmt)}원`;

  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;

    ElementTotalPrice.appendChild(span);
  }

  renderStockInfo();
  renderLoyaltyPoints();
};

main();

ElementAddCartBtn.addEventListener('click', function () {
  const addProductId = ElementProductSelect.value;
  const itemToAdd = productList.find(function (product) {
    return product.id === addProductId;
  });

  if (itemToAdd && itemToAdd.stock > 0) {
    const item = document.getElementById(itemToAdd.id);
    if (item) {
      const newQty =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;

      if (newQty <= itemToAdd.stock) {
        item.querySelector(
          'span'
        ).textContent = `${itemToAdd.name} - ${itemToAdd.price}원 x ${newQty}`;
        itemToAdd.stock--;
      } else {
        alert(OUT_OF_STOCK_MSG);
      }
    } else {
      const newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML = `
      <span>${itemToAdd.name} - ${itemToAdd.price}원 x 1</span>
      <div>
        <button 
          class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
          data-product-id="${itemToAdd.id}" 
          data-change="-1">-</button>
        <button 
          class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
          data-product-id="${itemToAdd.id}" 
          data-change="1">+</button>
        <button 
          class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
          data-product-id="${itemToAdd.id}">삭제</button>
      </div>
      `;
      ElementCartItems.appendChild(newItem);
      itemToAdd.stock--;
    }

    calcCart();
    lastAddCartProductId = addProductId;
  }
});

ElementCartItems.addEventListener('click', function (event) {
  const target = event.target;

  if (
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item')
  ) {
    const productId = target.dataset.productId;
    const ElementCartItem = document.getElementById(productId);
    const product = productList.find(function (product) {
      return product.id === productId;
    });

    if (target.classList.contains('quantity-change')) {
      const qtyChange = parseInt(target.dataset.change);
      const newQty =
        parseInt(
          ElementCartItem.querySelector('span').textContent.split('x ')[1]
        ) + qtyChange;
      if (
        newQty > 0 &&
        newQty <=
          product.stock +
            parseInt(
              ElementCartItem.querySelector('span').textContent.split('x ')[1]
            )
      ) {
        ElementCartItem.querySelector('span').textContent =
          ElementCartItem.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          newQty;
        product.stock -= qtyChange;
      } else if (newQty <= 0) {
        ElementCartItem.remove();
        product.stock -= qtyChange;
      } else {
        alert(OUT_OF_STOCK_MSG);
      }
    } else if (target.classList.contains('remove-item')) {
      const remQuantity = parseInt(
        ElementCartItem.querySelector('span').textContent.split('x ')[1]
      );
      product.stock += remQuantity;
      ElementCartItem.remove();
    }
    calcCart();
  }
});
