import App from './components/App.js';
import {
  startLightningSale,
  startRecommendProduct,
  updateSelectedOptions,
} from './logic/logic.js'; //메인 함수

function main() {
  const root = document.getElementById('app');
  root.appendChild(App());

  const selectedOptions = document.getElementById('product-select');

  updateSelectedOptions(selectedOptions);
  startLightningSale(selectedOptions);
  startRecommendProduct(selectedOptions);
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
