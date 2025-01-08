import { CartItem, CartItemInfo } from "../components";
import { productsStore } from "../store/productsStore";
import { appendToElement, calcCart, getProdData, replaceToElement, splitItemPriceQuantity } from "../utils";

const products = productsStore.getInstance().getProducts();

export const addToCartClickHandler = () => {
  const selItem = document.querySelector("#product-select").value;
  const itemToAdd = products.find((p) => p.id === selItem);

  if (!(itemToAdd && itemToAdd.quantity > 0)) return;

  const itemElem = document.getElementById(itemToAdd.id);
  if (itemElem) {
    const [_, curQuantity] = splitItemPriceQuantity(itemElem);
    const newQty = Number(curQuantity) + 1;
    if (newQty <= itemToAdd.quantity) {
      replaceToElement(`#${itemToAdd.id} > span`, CartItemInfo({ ...itemToAdd, quantity: newQty }));
      itemToAdd.quantity--;
    } else {
      alert("재고가 부족합니다.");
    }
  } else {
    appendToElement("#cart-items", CartItem(itemToAdd));
    itemToAdd.quantity--;
  }
  calcCart();
  return selItem;
};

export const cartItemsClickHandler = (event) => {
  const { classList, dataset } = event.target;

  if (classList.contains("quantity-change")) {
    quantityChange(dataset);
  }

  if (classList.contains("remove-item")) {
    removeItem(dataset);
  }

  calcCart();
};

const quantityChange = ({ productId, change }) => {
  const qtyChange = Number(change);
  const { prod, itemElem, curQuantity } = getProdData(productId);
  const newQty = curQuantity + qtyChange;
  const totalQty = prod.quantity + curQuantity;

  if (newQty > 0 && newQty <= totalQty) {
    replaceToElement(`#${itemElem.id} > span`, CartItemInfo({ ...prod, quantity: newQty }));
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
