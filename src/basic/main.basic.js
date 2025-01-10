import { AddToCart } from "./components/AddToCart";
import { BonusPoints } from "./components/BonusPoints";
import { CartItems } from "./components/CartItemDisplay";
import { CartTotal } from "./components/CartTotal";
import { Content } from "./components/Content";
import { DiscountRate } from "./components/DiscountRate";
import { Heading } from "./components/Heading";
import { ProductOption } from "./components/ProductOption";
import { ProductSelect } from "./components/ProductSelect";
import { StockStatus } from "./components/StockStatus";
import { Wrap } from "./components/Wrap";
import { PRODUCTS } from "./constant/products";
import Cart from "./domain/cart/cart";
import Item from "./domain/item/item";
import { startCommercialSale } from "./domain/sale/commercial-sale";
import { startLuckySale } from "./domain/sale/lucky-sale";
import Stock from "./domain/stock/stock";
import { handleExistingCartItem, handleNewCartItem, isItemAvailable } from "./events-utils/add-button";
import {
  handleQuantityChange,
  handleRemoveAction,
  isCartAction,
  isQuantityChangeAction,
  isRemoveAction,
} from "./events-utils/cart-item-display";

// ! 나름의 그라데이션 사고, 데이터, 추상화적 사고 적용
// ! 근데 ui 는 어떻게 추상화 + 흐름을 가져가야할지 모르겠다! => 조사해보니 MVC 등장 이유를 알겠다.. 근데 이 코드에 어떻게 적용할지는 모르겠다. ui 쪽은 좀 더 생각해보고 구현할 걸...
// ! 통일성 부족..
// ! 내부에 선언된 변수에 대한 직접적인 참조없인 코드가 돌아가지 않는다. 특히, ui에 대한 직접적인 참조없인 코드가 돌아가지 않는다

// 유저가 셀렉트에서 아이템을 선택해 추가한다 -> 총액을 표시한다. 상품수를 표시한다. 포인트를 표시한다.
// 유저가 +,-, 삭제 버튼을 누른다. -> 총액을 표시한다. 상품 수를 표시한다. 포인트를 표시한다.
// 이벤트 타임이다 -> 상품의 가격이 변동된다.
// 상태에 따라서 ui 표시 -> 유저 이벤트 감지 -> 상태 변경 -> ui에 반영 => 상태(데이터), ui, 이벤트 감지
// 상태: 장바구니에 담긴 아이템(수), 총액(할인율, 포인트) => 장바구니에 담긴 아이템의 종류와 수만 필요하지 않을까?
// 여기저기서 꼬인 느낌... 하나의 책임을 하지 못함 => 건드렸다가 와장창 무너지는 건 일단 맨 나중에 리팩토링..
// 어디서부터 손대야 할지 모르겟음... => 일단 침착하고 용감하게, 가장 거슬리면서도 가장 바꾸기 쉬운 것부터 리팩토링하니까 길이 보이더라..
// 변수 이름도 좀 더 통일성을 가져야함

function main() {
  let lastSelectedProduct;
  const cartItems = new Cart();
  const stockItems = new Stock(PRODUCTS.map((p) => new Item({ ...p })));

  const root = document.getElementById("app");
  const content = Content();
  const wrap = Wrap();
  const heading = Heading();
  const cartItemDisplay = CartItems();
  const summary = CartTotal();
  const select = ProductSelect(stockItems.items);
  const addButton = AddToCart();
  const stock = StockStatus();

  updateProductOption();

  wrap.appendChild(heading);
  wrap.appendChild(cartItemDisplay);
  wrap.appendChild(summary);
  wrap.appendChild(select);
  wrap.appendChild(addButton);
  wrap.appendChild(stock);

  content.appendChild(wrap);

  root.appendChild(content.element);

  addButton.onClick(handleClickAddButton);
  cartItemDisplay.onClick(handleClickCartItemDisplay);

  updateCartSummary();
  updateStockInfoMessage();
  startLuckySale(stockItems.items, updateProductOption);
  startCommercialSale(stockItems.items, lastSelectedProduct, updateProductOption);

  function handleClickAddButton() {
    const selectedItem = select.getValue();
    const itemToAdd = stockItems.findById(selectedItem);

    if (isItemAvailable(itemToAdd)) {
      const cartItem = cartItems.findById(itemToAdd.id);
      const itemElement = cartItemDisplay.findChildById(itemToAdd.id);

      if (cartItem) {
        handleExistingCartItem(cartItem, itemToAdd, itemElement);
      } else {
        handleNewCartItem(itemToAdd, cartItemDisplay, cartItems);
      }

      updateCartSummary();
      updateStockInfoMessage();
      lastSelectedProduct = selectedItem;
    }
  }

  function handleClickCartItemDisplay(event) {
    const target = event.target;

    if (isCartAction(target)) {
      const productId = target.dataset.productId;
      const itemElement = cartItemDisplay.findChildById(productId);
      const product = stockItems.findById(productId);
      const cartItem = cartItems.findById(productId);

      if (isQuantityChangeAction(target)) {
        handleQuantityChange(target, product, cartItem, itemElement);
      } else if (isRemoveAction(target)) {
        handleRemoveAction(product, cartItem, itemElement, cartItems);
      }

      updateCartSummary();
      updateStockInfoMessage();
    }
  }

  function updateProductOption() {
    select.handleUpdateProductOption(stockItems.items, ProductOption);
  }

  function updateCartSummary() {
    const { totalAmount, discountRate, bonusPoints } = cartItems;
    summary.handleUpdateCartSummary({
      totalAmount,
      discountRate,
      bonusPoints,
      DiscountRateComponent: DiscountRate,
      BonusPointsComponent: BonusPoints,
    });
  }

  function updateStockInfoMessage() {
    stock.handleChangeTextContent(stockItems.generateStockInfoMessage());
  }
}

main();
