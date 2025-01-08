import { CartPage } from "./pages/cart-page";

interface Product {
  id: string;
  name: string;
  val: number;
  q: number;
}

let products: Product[];
let lastSelectedItem: string;
let bonusPoints = 0;
let totalAmount = 0;
let itemCount = 0;

function main() {
  products = [
    { id: "p1", name: "상품1", val: 10000, q: 50 },
    { id: "p2", name: "상품2", val: 20000, q: 30 },
    { id: "p3", name: "상품3", val: 30000, q: 20 },
    { id: "p4", name: "상품4", val: 15000, q: 0 },
    { id: "p5", name: "상품5", val: 25000, q: 10 }
  ];
  const $root = document.getElementById("app") as HTMLDivElement;
  $root.innerHTML = CartPage();
  updateSelOpts();
  calcCart();
  setTimeout(function () {
    setInterval(function () {
      const luckyItem = products[Math.floor(Math.random() * products.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
        updateSelOpts();
      }
    }, 30000);
  }, Math.random() * 10000);
  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedItem) {
        const suggest = products.find(function (item) {
          return item.id !== lastSelectedItem && item.q > 0;
        });
        if (suggest) {
          alert(
            suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!"
          );
          suggest.val = Math.round(suggest.val * 0.95);
          updateSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}
function updateSelOpts() {
  const $productSelect = document.getElementById("product-select");

  if (!$productSelect) return;

  $productSelect.innerHTML = "";
  products.forEach((product) => {
    const $option = document.createElement("option");
    $option.value = product.id;
    $option.textContent = product.name + " - " + product.val + "원";
    if (product.q === 0) $option.disabled = true;
    $productSelect.appendChild($option);
  });
}
function calcCart() {
  const $cartDisplay = document.getElementById("cart-items");
  if (!$cartDisplay) return;

  const $cartTotal = document.getElementById("cart-total");
  if (!$cartTotal) return;

  totalAmount = 0;
  itemCount = 0;
  const cartItems = $cartDisplay.children;
  let subTot = 0;
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < products.length; j++) {
        if (products[j].id === cartItems[i].id) {
          curItem = products[j];
          break;
        }
      }

      if (!curItem) return;

      const $cartItemSpan = cartItems[i].querySelector("span");

      if (!$cartItemSpan || !$cartItemSpan.textContent) return;

      const q = parseInt($cartItemSpan.textContent.split("x ")[1]);
      const itemTot = curItem.val * q;
      let discount = 0;
      itemCount += q;
      subTot += itemTot;
      if (q >= 10) {
        if (curItem.id === "p1") discount = 0.1;
        else if (curItem.id === "p2") discount = 0.15;
        else if (curItem.id === "p3") discount = 0.2;
        else if (curItem.id === "p4") discount = 0.05;
        else if (curItem.id === "p5") discount = 0.25;
      }
      totalAmount += itemTot * (1 - discount);
    })();
  }
  let discountRate = 0;
  if (itemCount >= 30) {
    const bulkDisc = totalAmount * 0.25;
    const itemDisc = subTot - totalAmount;
    if (bulkDisc > itemDisc) {
      totalAmount = subTot * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subTot - totalAmount) / subTot;
    }
  } else {
    discountRate = (subTot - totalAmount) / subTot;
  }
  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }
  $cartTotal.textContent = "총액: " + Math.round(totalAmount) + "원";
  if (discountRate > 0) {
    const span = document.createElement("span");
    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discountRate * 100).toFixed(1) + "% 할인 적용)";
    $cartTotal.appendChild(span);
  }
  updateStockInfo();
  renderBonusPts();
}
const renderBonusPts = () => {
  const $cartTotal = document.getElementById("cart-total");
  if (!$cartTotal) return;

  bonusPoints = Math.floor(totalAmount / 1000);
  let ptsTag = document.getElementById("loyalty-points");
  if (!ptsTag) {
    ptsTag = document.createElement("span");
    ptsTag.id = "loyalty-points";
    ptsTag.className = "text-blue-500 ml-2";
    $cartTotal.appendChild(ptsTag);
  }
  ptsTag.textContent = "(포인트: " + bonusPoints + ")";
};
function updateStockInfo() {
  const $stockStatus = document.getElementById("stock-status");

  if (!$stockStatus) return;

  let infoMsg = "";
  products.forEach(function (item) {
    if (item.q < 5) {
      infoMsg +=
        item.name +
        ": " +
        (item.q > 0 ? "재고 부족 (" + item.q + "개 남음)" : "품절") +
        "\n";
    }
  });
  $stockStatus.textContent = infoMsg;
}

main();

document.getElementById("add-to-cart")!.addEventListener("click", function () {
  const $productSelect = document.getElementById(
    "product-select"
  ) as HTMLSelectElement;

  if (!$productSelect) return;

  const selItem = $productSelect.value;
  const itemToAdd = products.find(function (p) {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.q > 0) {
    const $item = document.getElementById(itemToAdd.id);
    if ($item) {
      const $itemSpan = $item.querySelector("span");

      if (!$itemSpan || !$itemSpan.textContent) return;

      const newQuantity = parseInt($itemSpan.textContent.split("x ")[1]) + 1;

      if (newQuantity <= itemToAdd.q) {
        $itemSpan.textContent =
          itemToAdd.name + " - " + itemToAdd.val + "원 x " + newQuantity;
        itemToAdd.q--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      const $cartDisplay = document.getElementById("cart-items");

      if (!$cartDisplay) return;

      const newItem = document.createElement("div");
      newItem.id = itemToAdd.id;
      newItem.className = "flex justify-between items-center mb-2";
      newItem.innerHTML =
        "<span>" +
        itemToAdd.name +
        " - " +
        itemToAdd.val +
        "원 x 1</span><div>" +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>';
      $cartDisplay.appendChild(newItem);
      itemToAdd.q--;
    }
    calcCart();
    lastSelectedItem = selItem;
  }
});

document
  .getElementById("cart-items")!
  .addEventListener("click", function (event) {
    const target = event.target as HTMLElement;
    if (
      target.classList.contains("quantity-change") ||
      target.classList.contains("remove-item")
    ) {
      const productId = target.dataset.productId;
      if (!productId) return;

      const $cartItem = document.getElementById(productId);
      const product = products.find((product) => {
        return product.id === productId;
      });

      if (!product) return;

      if (target.classList.contains("quantity-change")) {
        const quantityChange = parseInt(target.dataset.change || "0");

        const $cartItemSpan = $cartItem?.querySelector("span");

        if (!$cartItemSpan || !$cartItemSpan.textContent) return;

        const newQuantity =
          parseInt($cartItemSpan.textContent.split("x ")[1]) + quantityChange;

        if (
          newQuantity > 0 &&
          newQuantity <=
            product.q + parseInt($cartItemSpan.textContent.split("x ")[1])
        ) {
          $cartItemSpan.textContent =
            $cartItemSpan.textContent.split("x ")[0] + "x " + newQuantity;
          product.q -= quantityChange;
        } else if (newQuantity <= 0) {
          $cartItem?.remove();
          product.q -= quantityChange;
        } else {
          alert("재고가 부족합니다.");
        }
      } else if (target.classList.contains("remove-item")) {
        const $cartItemSpan = $cartItem?.querySelector("span");

        if (!$cartItemSpan || !$cartItemSpan.textContent) return;

        const remQty = parseInt($cartItemSpan.textContent.split("x ")[1]);
        product.q += remQty;
        $cartItem?.remove();
      }
      calcCart();
    }
  });
