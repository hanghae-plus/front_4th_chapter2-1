import App from './components/App.js';
import { productData } from './data/data.js';
import { calculateCart, updateSelectedOptions } from './logic/logic.js'; //메인 함수

function main() {
  const root = document.getElementById('app');
  root.appendChild(App());

  const selectedOptions = document.getElementById('product-select');
  const cartDisplay = document.getElementById('cart-items');
  const totalSum = document.getElementById('cart-total');
  const stockInfo = document.getElementById('stock-status');
  const addToCartButton = document.getElementById('add-to-cart');

  updateSelectedOptions(selectedOptions);
  calculateCart(cartDisplay, totalSum);

  setTimeout(function () {
    setInterval(function () {
      var luckyItem =
        productData[Math.floor(Math.random() * productData.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelectedOptions(selectedOptions);
      }
    }, 30000);
  }, Math.random() * 10000);
  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        const suggest = productData.find(function (item) {
          return item.id !== lastSel && item.quantity > 0;
        });
        if (suggest) {
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );
          suggest.price = Math.round(suggest.price * 0.95);
          updateSelectedOptions(selectedOptions);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

//실행
main();
// //추가 버튼 이벤트 리스너
// addBtn.addEventListener('click', function () {
//   const selItem = sel.value;
//   const itemToAdd = productData.find(function (p) {
//     return p.id === selItem;
//   });
//   if (itemToAdd && itemToAdd.quantity > 0) {
//     var item = document.getElementById(itemToAdd.id);
//     if (item) {
//       var newQty =
//         parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
//       if (newQty <= itemToAdd.quantity) {
//         item.querySelector('span').textContent =
//           itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;
//         itemToAdd.quantity--;
//       } else {
//         alert('재고가 부족합니다.');
//       }
//     } else {
//       var newItem = document.createElement('div');
//       newItem.id = itemToAdd.id;
//       newItem.className = 'flex justify-between items-center mb-2';
//       newItem.innerHTML =
//         '<span>' +
//         itemToAdd.name +
//         ' - ' +
//         itemToAdd.price +
//         '원 x 1</span><div>' +
//         '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
//         itemToAdd.id +
//         '" data-change="-1">-</button>' +
//         '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
//         itemToAdd.id +
//         '" data-change="1">+</button>' +
//         '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
//         itemToAdd.id +
//         '">삭제</button></div>';
//       cartDisp.appendChild(newItem);
//       itemToAdd.quantity--;
//     }
//     calcCart();
//     lastSel = selItem;
//   }
// });

// //장바구니 이벤트 리스너
// cartDisp.addEventListener('click', function (event) {
//   var tgt = event.target;
//   if (
//     tgt.classList.contains('quantity-change') ||
//     tgt.classList.contains('remove-item')
//   ) {
//     const prodId = tgt.dataset.productId;
//     var itemElem = document.getElementById(prodId);
//     var prod = productData.find(function (p) {
//       return p.id === prodId;
//     });
//     if (tgt.classList.contains('quantity-change')) {
//       var qtyChange = parseInt(tgt.dataset.change);
//       var newQty =
//         parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) +
//         qtyChange;
//       if (
//         newQty > 0 &&
//         newQty <=
//           prod.quantity +
//             parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
//       ) {
//         itemElem.querySelector('span').textContent =
//           itemElem.querySelector('span').textContent.split('x ')[0] +
//           'x ' +
//           newQty;
//         prod.q -= qtyChange;
//       } else if (newQty <= 0) {
//         itemElem.remove();
//         prod.q -= qtyChange;
//       } else {
//         alert('재고가 부족합니다.');
//       }
//     } else if (tgt.classList.contains('remove-item')) {
//       var remQty = parseInt(
//         itemElem.querySelector('span').textContent.split('x ')[1]
//       );
//       prod.q += remQty;
//       itemElem.remove();
//     }
//     calcCart();
//   }
// });
