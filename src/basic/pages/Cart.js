import {
  CartHeader,
  CartSummary,
  ProductSelect,
  ProductAddButton,
  StockInformation,
  CartItem,
} from "../components/Cart";
import { cartStore, productStore } from "../store";

export const Cart = () => {
  const $cartContainer = document.createElement("div");
  $cartContainer.className = "bg-gray-100 p-8";

  const $cartWrapper = document.createElement("div");
  $cartWrapper.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";

  // 컴포넌트 생성 및 참조 저장
  const $header = CartHeader();
  const $cartItems = CartItem();
  const $cartSummary = CartSummary();
  const $productSelect = ProductSelect();
  const $addButton = ProductAddButton();
  const $stockInfo = StockInformation();

  // 컴포넌트 추가
  $cartWrapper.appendChild($header);
  $cartWrapper.appendChild($cartItems);
  $cartWrapper.appendChild($cartSummary);
  $cartWrapper.appendChild($productSelect);
  $cartWrapper.appendChild($addButton);
  $cartWrapper.appendChild($stockInfo);
  $cartContainer.appendChild($cartWrapper);

  // initialize 함수 호출
  const productList = productStore.getProducts();
  const { itemCnt, totalAmt, bonusPts } = cartStore.getCartState();

  const updateSelOpts = () => {
    $productSelect.innerHTML = "";
    productList.forEach(function (item) {
      const $productOption = document.createElement("option");
      $productOption.value = item.id;
      $productOption.textContent = item.name + " - " + item.val + "원";
      if (item.q === 0) $productOption.disabled = true;
      $productSelect.appendChild($productOption);
    });
  };

  const updateStockInfo = () => {
    var infoMsg = "";
    productList.forEach(function (item) {
      if (item.q < 5) {
        infoMsg +=
          item.name +
          ": " +
          (item.q > 0 ? "재고 부족 (" + item.q + "개 남음)" : "품절") +
          "\n";
      }
    });
    $stockInfo.textContent = infoMsg;
  };

  const renderBonusPts = () => {
    cartStore.setCartState({
      ...cartStore.getCartState(),
      bonusPts: Math.floor(totalAmt / 1000),
    });

    let $ptsTag = document.getElementById("loyalty-points");
    if (!$ptsTag) {
      $ptsTag = document.createElement("span");
      $ptsTag.id = "loyalty-points";
      $ptsTag.className = "text-blue-500 ml-2";
      $cartSummary.appendChild($ptsTag);
    }
    $ptsTag.textContent = "(포인트: " + bonusPts + ")";
  };

  const calcCart = () => {
    const cartItems = $cartItems.children;

    // 현재 상태 유지하면서 totalAmt와 itemCnt만 초기화
    const currentState = cartStore.getCartState();
    cartStore.setCartState({
      ...currentState,
      newTotalAmt: 0,
      newItemCnt: 0,
    });

    var subTot = 0;
    for (var i = 0; i < cartItems.length; i++) {
      (function () {
        var curItem;
        for (var j = 0; j < productList.length; j++) {
          if (productList[j].id === cartItems[i].id) {
            curItem = productList[j];
            break;
          }
        }
        var q = parseInt(
          cartItems[i].querySelector("span").textContent.split("x ")[1],
        );
        var itemTot = curItem.val * q;
        var disc = 0;

        // itemCnt 누적
        cartStore.setCartState({
          ...cartStore.getCartState(),
          newItemCnt: cartStore.getItemCnt() + q,
        });

        subTot += itemTot;
        if (q >= 10) {
          if (curItem.id === "p1") disc = 0.1;
          else if (curItem.id === "p2") disc = 0.15;
          else if (curItem.id === "p3") disc = 0.2;
          else if (curItem.id === "p4") disc = 0.05;
          else if (curItem.id === "p5") disc = 0.25;
        }

        // totalAmt 누적
        cartStore.setCartState({
          ...cartStore.getCartState(),
          newTotalAmt: cartStore.getTotalAmt() + itemTot * (1 - disc),
        });
      })();
    }

    let discRate = 0;
    const { totalAmt, itemCnt } = cartStore.getCartState();

    if (itemCnt >= 30) {
      var bulkDisc = totalAmt * 0.25;
      var itemDisc = subTot - totalAmt;
      if (bulkDisc > itemDisc) {
        cartStore.setCartState({
          ...cartStore.getCartState(),
          newTotalAmt: subTot * (1 - 0.25),
        });
        discRate = 0.25;
      } else {
        discRate = (subTot - totalAmt) / subTot;
      }
    } else {
      discRate = (subTot - totalAmt) / subTot;
    }

    if (new Date().getDay() === 2) {
      cartStore.setCartState({
        ...cartStore.getCartState(),
        newTotalAmt: cartStore.getTotalAmt() * 0.9,
      });
      discRate = Math.max(discRate, 0.1);
    }

    $cartSummary.textContent =
      "총액: " + Math.round(cartStore.getTotalAmt()) + "원";

    if (discRate > 0) {
      const $span = document.createElement("span");
      $span.className = "text-green-500 ml-2";
      $span.textContent = "(" + (discRate * 100).toFixed(1) + "% 할인 적용)";
      $cartSummary.appendChild($span);
    }

    updateStockInfo();
    renderBonusPts();
  };

  updateSelOpts();
  calcCart();

  setTimeout(function () {
    setInterval(function () {
      const luckyItem =
        productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
        updateSelOpts();
      }
    }, 30000);
  }, Math.random() * 10000);
  setTimeout(function () {
    setInterval(function () {
      if (cartStore.getLastSel()) {
        const suggest = productList.find(function (item) {
          return item.id !== cartStore.getLastSel() && item.q > 0;
        });
        if (suggest) {
          alert(
            suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!",
          );
          suggest.val = Math.round(suggest.val * 0.95);
          updateSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);

  // 장바구니 아이템 추가 이벤트 리스너
  $addButton.addEventListener("click", function () {
    const selItem = $productSelect.value;
    const itemToAdd = productStore.getProducts().find((p) => p.id === selItem);

    if (itemToAdd && itemToAdd.q > 0) {
      const $cartItems = document.getElementById("cart-items");
      const item = document.getElementById(itemToAdd.id);

      if (item) {
        const newQty =
          parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;
        if (newQty <= itemToAdd.q) {
          item.querySelector("span").textContent =
            `${itemToAdd.name} - ${itemToAdd.val}원 x ${newQty}`;
          itemToAdd.q--;
        } else {
          alert("재고가 부족합니다.");
        }
      } else {
        const newItem = document.createElement("div");
        newItem.id = itemToAdd.id;
        newItem.className = "flex justify-between items-center mb-2";
        newItem.innerHTML = `
          <span>${itemToAdd.name} - ${itemToAdd.val}원 x 1</span>
          <div>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
            <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
          </div>
        `;
        $cartItems.appendChild(newItem);
        itemToAdd.q--;
      }
      calcCart();
      cartStore.setLastSel(selItem);
    }
  });

  // 장바구니 아이템 수량 변경 및 삭제 이벤트 리스너
  $cartItems.addEventListener("click", function (event) {
    const tgt = event.target;
    if (
      tgt.classList.contains("quantity-change") ||
      tgt.classList.contains("remove-item")
    ) {
      const prodId = tgt.dataset.productId;
      const itemElem = document.getElementById(prodId);
      const prod = productStore.getProducts().find((p) => p.id === prodId);

      if (tgt.classList.contains("quantity-change")) {
        const qtyChange = parseInt(tgt.dataset.change);
        const currentQty = parseInt(
          itemElem.querySelector("span").textContent.split("x ")[1],
        );
        const newQty = currentQty + qtyChange;

        if (newQty > 0 && newQty <= prod.q + currentQty) {
          itemElem.querySelector("span").textContent =
            `${itemElem.querySelector("span").textContent.split("x ")[0]}x ${newQty}`;
          prod.q -= qtyChange;
        } else if (newQty <= 0) {
          itemElem.remove();
          prod.q -= qtyChange;
        } else {
          alert("재고가 부족합니다.");
        }
      } else if (tgt.classList.contains("remove-item")) {
        const remQty = parseInt(
          itemElem.querySelector("span").textContent.split("x ")[1],
        );
        prod.q += remQty;
        itemElem.remove();
      }
      calcCart();
    }
  });

  return $cartContainer;
};
