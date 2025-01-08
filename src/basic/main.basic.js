import { AddToCart } from "./components/AddToCart";
import { CartItems } from "./components/CartItemDisplay";
import { CartTotal } from "./components/CartTotal";
import { Content } from "./components/Content";
import { Heading } from "./components/Heading";
import { ProductOption } from "./components/ProductOption";
import { ProductSelect } from "./components/ProductSelect";
import { StockStatus } from "./components/StockStatus";
import { Wrap } from "./components/Wrap";
import { PRODUCTS } from "./constant/products";
import { startCommercialSale } from "./domain/commercial-sale";
import { startLuckySale } from "./domain/lucky-sale";

// 유저가 셀렉트에서 아이템을 선택해 추가한다 -> 총액을 표시한다. 상품수를 표시한다. 포인트를 표시한다.
// 유저가 +,-, 삭제 버튼을 누른다. -> 총액을 표시한다. 상품 수를 표시한다. 포인트를 표시한다.
// 이벤트 타임이다 -> 상품의 가격이 변동된다.
// 상태에 따라서 ui 표시 -> 유저 이벤트 감지 -> 상태 변경 -> ui에 반영
// 상태: 장바구니에 담긴 아이템(수), 총액(할인율, 포인트) => 장바구니에 담긴 아이템의 종류와 수만 필요하지 않을까?
// 여기저기서 꼬인 느낌... 하나의 책임을 하지 못함
// 어디서부터 손대야 할지 모르겟음...

// * 필요한 변수 선언 (전역으로...)
let select, addButton, cartItemDisplay, sum, stock;
let lastSelectedProduct,
  bonusPoints = 0,
  totalAmount = 0,
  itemCount = 0;

const cartItems = []; // 현재 장바구니에 담은 아이템의 정보를 담을 배열

function main() {
  // 필요한 ui 만들기
  render();

  calculateCart();

  startLuckySale(PRODUCTS, updateProductOption);

  startCommercialSale(PRODUCTS, lastSelectedProduct, updateProductOption);
}

function render() {
  // ! ui를 좀 더 잘 구현하는 방법...
  const root = document.getElementById("app");

  const content = Content();
  const wrap = Wrap();
  const heading = Heading();
  cartItemDisplay = CartItems();
  sum = CartTotal();
  select = ProductSelect();
  addButton = AddToCart();
  stock = StockStatus();

  updateProductOption();

  wrap.appendChild(heading);
  wrap.appendChild(cartItemDisplay);
  wrap.appendChild(sum);
  wrap.appendChild(select);
  wrap.appendChild(addButton);
  wrap.appendChild(stock);

  content.appendChild(wrap);

  root.appendChild(content);
}

function updateProductOption() {
  select.innerHTML = ``;

  PRODUCTS.forEach((item) => {
    const option = ProductOption({ item });
    select.appendChild(option);
  });
}

// 총액 + 할인율 계산해서 표시하는 함수
function calculateCart() {
  totalAmount = 0;
  itemCount = 0;

  let originalTotalPrice = 0;

  cartItems.forEach((item) => {
    // * 장바구니에 담겨져 있는 아이템을 돌면서

    // * 총액 개산
    let curItem = item;

    // * 해당 상품이 몇 개 담겨져 있는지 찾기
    const quantity = curItem.quantity;

    // * 상품의 가격 * 상품의 수 = 장바구니에 담은 해당 상품의 가격의 총합
    let itemTotalPrice = curItem.value * quantity;

    // * 할인율;;
    let discount = 0;

    itemCount += quantity;

    // 할인율 적용하기 전 총액
    originalTotalPrice += itemTotalPrice;

    // * 만약 해당 상품이 10개 이상 담겨져 있다면 상품에 따라 다른 할인율 적용
    if (quantity >= 10) {
      if (curItem.id === "p1") discount = 0.1;
      else if (curItem.id === "p2") discount = 0.15;
      else if (curItem.id === "p3") discount = 0.2;
      else if (curItem.id === "p4") discount = 0.05;
      else if (curItem.id === "p5") discount = 0.25;
    }

    // * 총액 갱신
    totalAmount += itemTotalPrice * (1 - discount);
  });

  // * 총 얼마의 할인율이 적용되었는지 계산
  let discountRate = 0;

  // * 상품 구매 개수에 따른 할인
  if (itemCount >= 30) {
    const bulkDiscount = totalAmount * 0.25;
    const itemDiscount = originalTotalPrice - totalAmount;
    if (bulkDiscount > itemDiscount) {
      totalAmount = originalTotalPrice * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (originalTotalPrice - totalAmount) / originalTotalPrice;
    }
  } else {
    discountRate = (originalTotalPrice - totalAmount) / originalTotalPrice;
  }

  // 날짜에 따른 할인
  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  // 총액 및 할인율 최종 표시
  sum.textContent = "총액: " + Math.round(totalAmount) + "원";
  if (discountRate > 0) {
    const span = document.createElement("span");
    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discountRate * 100).toFixed(1) + "% 할인 적용)";
    sum.appendChild(span);
  }

  updateStockInfo();
  renderBonusPoints();
}

// 적립되는 포인트 계산 및 표시하는 함수
function renderBonusPoints() {
  bonusPoints = Math.floor(totalAmount / 1000);

  let pointsTag = document.getElementById("loyalty-points");

  if (!pointsTag) {
    pointsTag = document.createElement("span");
    pointsTag.id = "loyalty-points";
    pointsTag.className = "text-blue-500 ml-2";
    sum.appendChild(pointsTag);
  }

  pointsTag.textContent = "(포인트: " + bonusPoints + ")";
}

// 재고 정보 업데이트하는 함수
function updateStockInfo() {
  let infoMessage = "";
  PRODUCTS.forEach((item) => {
    if (item.quantity < 5) {
      infoMessage +=
        item.name + ": " + (item.quantity > 0 ? "재고 부족 (" + item.quantity + "개 남음)" : "품절") + "\n";
    }
  });
  stock.textContent = infoMessage;
}

main();

// 추가 버튼에 이벤트 리스너 연결
addButton.addEventListener("click", () => {
  // 옵션으로 선택한 아이템 찾기
  const selectedItem = select.value;
  const itemToAdd = PRODUCTS.find((p) => {
    return p.id === selectedItem;
  });

  // 아이템이 있는 아이템이고 재고가 남아있다면
  if (itemToAdd && itemToAdd.quantity > 0) {
    const cartItem = cartItems.find((i) => i.id === itemToAdd.id);
    const item = document.getElementById(itemToAdd.id);

    // 이미 한번 추가된 아이템이라면
    if (item) {
      const newQuantity = cartItem.quantity + 1;

      // 충분한 재고가 있다면
      if (newQuantity <= itemToAdd.quantity) {
        item.querySelector("span").textContent = itemToAdd.name + " - " + itemToAdd.value + "원 x " + newQuantity;
        itemToAdd.quantity--;
        cartItem.quantity++;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      // 한번도 추가되지 않은 아이템이라면 화면에 추가
      const newItem = document.createElement("div");
      newItem.id = itemToAdd.id;
      newItem.className = "flex justify-between items-center mb-2";
      newItem.innerHTML =
        "<span>" +
        itemToAdd.name +
        " - " +
        itemToAdd.value +
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
      cartItemDisplay.appendChild(newItem);
      itemToAdd.quantity--;
      cartItems.push({
        id: itemToAdd.id,
        quantity: 1,
        value: itemToAdd.value,
        name: itemToAdd.name,
      });
    }
    // 카트 갱신
    calculateCart();

    lastSelectedProduct = selectedItem;
  }
});

// 상품 +,-,삭제 버튼에 이벤트 리스너 연결
cartItemDisplay.addEventListener("click", (event) => {
  const target = event.target;

  // 상품 +,-,삭제 버튼을 눌렀다면
  if (target.classList.contains("quantity-change") || target.classList.contains("remove-item")) {
    const productId = target.dataset.productId;
    const itemElement = document.getElementById(productId);
    const product = PRODUCTS.find((p) => {
      return p.id === productId;
    });
    const cartItem = cartItems.find((i) => i.id === productId);

    // +,- 버튼을 눌렀다면
    if (target.classList.contains("quantity-change")) {
      // -1,+1
      const quantityChange = parseInt(target.dataset.change);

      // 갱신된 선택한 아이템의 수
      const newQuantity = cartItem.quantity + quantityChange;

      // 갱신된 선택한 아이템의 수가 0개 넘고 재고가 남아있다면
      if (newQuantity > 0 && newQuantity <= product.quantity + cartItem.quantity) {
        itemElement.querySelector("span").textContent =
          itemElement.querySelector("span").textContent.split("x ")[0] + "x " + newQuantity;
        product.quantity -= quantityChange;
        cartItem.quantity += quantityChange;
      } else if (newQuantity <= 0) {
        itemElement.remove();
        product.quantity -= quantityChange;
        cartItem.quantity += quantityChange;
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (target.classList.contains("remove-item")) {
      // 삭제 버튼을 눌렀다면
      const removeQuantity = parseInt(itemElement.querySelector("span").textContent.split("x ")[1]);
      product.quantity += removeQuantity;

      itemElement.remove();
      const index = cartItems.findIndex((i) => i.id === cartItem.id);
      cartItems.splice(index, 1);
    }
    // 카트 갱신
    calculateCart();
  }
});
