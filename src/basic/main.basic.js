import { AddToCart } from "./components/AddToCart";
import { BonusPoints } from "./components/BonusPoints";
import { CartItems } from "./components/CartItemDisplay";
import { CartTotal } from "./components/CartTotal";
import { Content } from "./components/Content";
import { DiscountRate } from "./components/DiscountRate";
import { Heading } from "./components/Heading";
import { NewCartItem } from "./components/NewCartItem";
import { ProductOption } from "./components/ProductOption";
import { ProductSelect } from "./components/ProductSelect";
import { StockStatus } from "./components/StockStatus";
import { Wrap } from "./components/Wrap";
import { PRODUCTS } from "./constant/products";
import Cart from "./domain/cart/Cart";
import CartItem from "./domain/cart/cart-item";
import Item from "./domain/item/item";
import { startCommercialSale } from "./domain/sale/commercial-sale";
import { startLuckySale } from "./domain/sale/lucky-sale";
import Stock from "./domain/stock/stock";

// ! 나름의 그라데이션 사고, 데이터, 추상화적 사고 적용
// ! 근데 ui 는 어떻게 추상화 + 흐름을 가져가야할지 모르겠다!
// ! 이대로 괜찮은가?

// 유저가 셀렉트에서 아이템을 선택해 추가한다 -> 총액을 표시한다. 상품수를 표시한다. 포인트를 표시한다.
// 유저가 +,-, 삭제 버튼을 누른다. -> 총액을 표시한다. 상품 수를 표시한다. 포인트를 표시한다.
// 이벤트 타임이다 -> 상품의 가격이 변동된다.
// 상태에 따라서 ui 표시 -> 유저 이벤트 감지 -> 상태 변경 -> ui에 반영
// 상태: 장바구니에 담긴 아이템(수), 총액(할인율, 포인트) => 장바구니에 담긴 아이템의 종류와 수만 필요하지 않을까?
// 여기저기서 꼬인 느낌... 하나의 책임을 하지 못함
// 어디서부터 손대야 할지 모르겟음... => 일단 침착하고 용감하게, 가장 거슬리면서도 가장 바꾸기 쉬운 것부터 리팩토링하니까 길이 보이더라..
// 변수 이름도 좀 더 통일성을 가져야함

// * 필요한 변수 선언 (전역으로...)
let select, addButton, cartItemDisplay, sum, stock;
let lastSelectedProduct;

const cartItems = new Cart(); // 현재 장바구니에 담은 아이템의 정보를 담을 배열
const stockItems = new Stock(PRODUCTS.map((p) => new Item({ ...p })));

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
  // 총액 및 할인율 최종 표시
  sum.textContent = "총액: " + Math.round(cartItems.totalAmount) + "원";
  if (cartItems.discountRate > 0) {
    sum.appendChild(DiscountRate(cartItems.discountRate));
  }
  updateStockInfo();
  sum.appendChild(BonusPoints(cartItems.bonusPoints));
}

// 재고 정보 업데이트하는 함수
function updateStockInfo() {
  stock.textContent = stockItems.generateStockInfoMessage();
}

main();

// 추가 버튼에 이벤트 리스너 연결
addButton.addEventListener("click", () => {
  // 옵션으로 선택한 아이템 찾기
  const selectedItem = select.value;
  const itemToAdd = stockItems.findById(selectedItem);

  // 아이템이 있는 아이템이고 재고가 남아있다면
  if (itemToAdd && itemToAdd.quantity > 0) {
    const cartItem = cartItems.findById(itemToAdd.id);
    const item = document.getElementById(itemToAdd.id);

    // 이미 한번 추가된 아이템이라면
    if (cartItem) {
      const newQuantity = cartItem.quantity + 1;

      // 충분한 재고가 있다면
      if (newQuantity <= itemToAdd.quantity) {
        item.querySelector("span").textContent = itemToAdd.name + " - " + itemToAdd.value + "원 x " + newQuantity;
        itemToAdd.decreaseQuantity();
        cartItem.increaseQuantity();
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      // 한번도 추가되지 않은 아이템이라면 화면에 추가
      const newItem = NewCartItem(itemToAdd);
      cartItemDisplay.appendChild(newItem);
      itemToAdd.decreaseQuantity();
      cartItems.push(
        new CartItem({
          id: itemToAdd.id,
          quantity: 1,
          value: itemToAdd.value,
          name: itemToAdd.name,
        }),
      );
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
    const product = stockItems.findById(productId);
    const cartItem = cartItems.findById(productId);

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
        product.decreaseQuantity(quantityChange);
        cartItem.increaseQuantity(quantityChange);
      } else if (newQuantity <= 0) {
        itemElement.remove();
        product.decreaseQuantity(quantityChange);
        cartItem.increaseQuantity(quantityChange);
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (target.classList.contains("remove-item")) {
      // 삭제 버튼을 눌렀다면
      const removeQuantity = parseInt(itemElement.querySelector("span").textContent.split("x ")[1]);
      product.increaseQuantity(removeQuantity);
      itemElement.remove();
      cartItems.removeItem(cartItem);
    }
    // 카트 갱신
    calculateCart();
  }
});
