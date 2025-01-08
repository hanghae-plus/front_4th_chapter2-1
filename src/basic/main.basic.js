import {
  CartItem,
  CartItemInfo,
  CartTotalPrice,
  DiscountRate,
  ItemOption,
  Points,
} from "./components";
import MainPage from "./pages/MainPage";
import {
  renderToElement,
  appendToElement,
  scheduleInterval,
  isLowStock,
  makeLowStockMessage,
  replaceToElement,
} from "./utils";

/**
 * 장바구니
 */
let shoppingCartTotal = 0;

const calcCart = () => {
  shoppingCartTotal = 0;
  let itemCnt = 0;
  let originTotalPrice = 0;
  let discountRate = 0;

  [...document.querySelector("#cart-items").children].forEach((item) => {
    const curItem = PRODUCTS.find((prod) => prod.id === item.id);
    const curQuantity = parseInt(
      item.querySelector("span").textContent.split("x ")[1]
    );
    const itemTotalPrice = curItem.price * curQuantity;
    itemCnt += curQuantity;
    originTotalPrice += itemTotalPrice;
    let discount = 1;
    if (curQuantity >= 10) {
      discount = 1 - curItem.discount;
    }
    shoppingCartTotal += itemTotalPrice * discount;
  });

  if (itemCnt >= 30) {
    const bulkDisc = originTotalPrice * 0.25;
    const itemDisc = originTotalPrice - shoppingCartTotal;
    if (bulkDisc > itemDisc) {
      shoppingCartTotal = originTotalPrice * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (originTotalPrice - shoppingCartTotal) / originTotalPrice;
    }
  } else {
    discountRate = (originTotalPrice - shoppingCartTotal) / originTotalPrice;
  }

  if (new Date().getDay() === 2) {
    shoppingCartTotal *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  renderToElement("#cart-total", CartTotalPrice(shoppingCartTotal));

  if (discountRate > 0) {
    appendToElement("#cart-total", DiscountRate(discountRate));
  }

  updateStockStatus();
  renderPoints();
};

const renderPoints = () => {
  const bonusPts = Math.floor(shoppingCartTotal / 1000);
  appendToElement("#cart-total", Points(bonusPts));
};

const addToCartClickHandler = () => {
  const selItem = document.querySelector("#product-select").value;
  const itemToAdd = PRODUCTS.find((p) => p.id === selItem);

  if (itemToAdd && itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd.id);
    if (item) {
      const newQty =
        parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;
      if (newQty <= itemToAdd.quantity) {
        replaceToElement(
          `#${itemToAdd.id} > span`,
          CartItemInfo({ ...itemToAdd, quantity: newQty })
        );
        itemToAdd.quantity--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      appendToElement("#cart-items", CartItem(itemToAdd));
      itemToAdd.quantity--;
    }
    calcCart();
    lastSel = selItem;
  }
};

const cartItemsClickHandler = (event) => {
  const { classList, dataset } = event.target;

  if (classList.contains("quantity-change")) {
    quantityChange(dataset);
  }

  if (classList.contains("remove-item")) {
    removeItem(dataset);
  }

  calcCart();
};

const splitItemPriceQuantity = (itemElement) =>
  itemElement.querySelector("span").textContent.split("x ");

const getProdData = (productId) => {
  const prod = PRODUCTS.find((p) => p.id === productId);
  const itemElem = document.getElementById(productId);
  const [_, curQuantity] = splitItemPriceQuantity(itemElem);

  return { prod, itemElem, curQuantity: parseInt(curQuantity) };
};

const quantityChange = ({ productId, change }) => {
  const qtyChange = parseInt(change);
  const { prod, itemElem, curQuantity } = getProdData(productId);
  const newQty = curQuantity + qtyChange;
  const totalQty = prod.quantity + curQuantity;

  if (newQty > 0 && newQty <= totalQty) {
    replaceToElement(
      `#${itemElem.id} > span`,
      CartItemInfo({ ...prod, quantity: newQty })
    );
    prod.quantity -= qtyChange;
    return;
  }

  if (newQty <= 0) {
    itemElem.remove();
    prod.quantity -= qtyChange;
    return;
  }

  alert("재고가 부족합니다.");
};

const removeItem = ({ productId }) => {
  const { prod, itemElem, curQuantity } = getProdData(productId);

  prod.quantity += curQuantity;
  itemElem.remove();
};

/**
 * 전체 상품
 */
const PRODUCTS = [
  { id: "p1", name: "상품1", price: 10000, quantity: 50, discount: 0.1 },
  { id: "p2", name: "상품2", price: 20000, quantity: 30, discount: 0.15 },
  { id: "p3", name: "상품3", price: 30000, quantity: 20, discount: 0.2 },
  { id: "p4", name: "상품4", price: 15000, quantity: 0, discount: 0.05 },
  { id: "p5", name: "상품5", price: 25000, quantity: 10, discount: 0.25 },
];

const updateSelOpts = () => {
  renderToElement("#product-select", PRODUCTS.map(ItemOption).join(""));
};

const updateStockStatus = () => {
  renderToElement(
    "#stock-status",
    PRODUCTS.filter(isLowStock).map(makeLowStockMessage).join("")
  );
};

/**
 * 공통 로직
 */
let lastSel = 0;

const saleEvent = () => {
  const luckyItem = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  if (Math.random() < 0.3 && luckyItem.quantity > 0) {
    luckyItem.price = Math.round(luckyItem.price * 0.8);
    alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
    updateSelOpts();
  }
};

const lastSelEvent = () => {
  if (lastSel) {
    const suggest = PRODUCTS.find(
      (item) => item.id !== lastSel && item.quantity > 0
    );
    if (suggest) {
      alert(suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!");
      suggest.price = Math.round(suggest.price * 0.95);
      updateSelOpts();
    }
  }
};

const main = () => {
  renderToElement("#app", MainPage());

  updateSelOpts();
  calcCart();

  scheduleInterval(saleEvent, 30000, 10000);
  scheduleInterval(lastSelEvent, 60000, 20000);

  document
    .querySelector("#add-to-cart")
    .addEventListener("click", addToCartClickHandler);
  document
    .querySelector("#cart-items")
    .addEventListener("click", cartItemsClickHandler);
};

main();
