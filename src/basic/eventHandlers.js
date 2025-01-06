import { CURRENCY, ID_BY_COMPONENT } from "./const";

export const handleClickAddBtn = (productList, updater) => {
  const select = document.querySelector(`#${ID_BY_COMPONENT.SELECT_ID}`);
  const cart = document.querySelector(`#${ID_BY_COMPONENT.CART_ID}`);

  const selItem = select.value;
  const itemToAdd = productList.find((p) => {
    return p.id === selItem;
  });

  if (!itemToAdd) return;

  // 선택된 아이템의 재고가 없는 경우
  if (itemToAdd.qty <= 0) return showOutOfStockAlert();

  const curItem = document.getElementById(itemToAdd.id);

  // 선택된 아이템이 이미 장바구니에 추가된 경우
  if (curItem) {
    const curQty = parseInt(
      curItem.querySelector("span").textContent.split("x ")[1],
    );
    const newQty = curQty + 1;
    if (newQty <= itemToAdd.qty + curQty) {
      curItem.querySelector(
        "span",
      ).textContent = `${itemToAdd.name} - ${itemToAdd.val}${CURRENCY} x ${newQty}`;
      itemToAdd.qty--;
    } else {
      showOutOfStockAlert();
    }
  }

  // 선택된 아이템을 새로 장바구니에 추가하는 경우
  else {
    const newItem = document.createElement("div");
    newItem.id = itemToAdd.id;
    newItem.className = "flex justify-between items-center mb-2";
    newItem.innerHTML = `
        <span>${itemToAdd.name} - ${itemToAdd.val}${CURRENCY} x 1</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
        </div>
      `;
    cart.appendChild(newItem);
    itemToAdd.qty--;
  }
  updater(selItem);
};

export const handleClickCart = (event, productList, updater) => {
  const tgt = event.target;
  if (
    !tgt.classList.contains("quantity-change") &&
    !tgt.classList.contains("remove-item")
  )
    return;

  const prodId = tgt.dataset.productId;
  const itemElem = document.getElementById(prodId);
  const prod = productList.find((p) => p.id === prodId);

  if (tgt.classList.contains("quantity-change")) {
    handleClickQtyChange(itemElem, prod, tgt);
  } else if (tgt.classList.contains("remove-item")) {
    handleClickRemoveItem(itemElem, prod);
  }
  updater();
};

const handleClickQtyChange = (itemElem, prod, tgt) => {
  const qtyChange = parseInt(tgt.dataset.change);
  const curQty = parseInt(
    itemElem.querySelector("span").textContent.split("x ")[1],
  );
  const newQty = curQty + qtyChange;

  // 변경될 수량이 0보다 큰 경우
  if (newQty > 0 && newQty <= prod.qty + curQty) {
    itemElem.querySelector("span").textContent = `${
      itemElem.querySelector("span").textContent.split("x ")[0]
    }x ${newQty}`;
    prod.qty -= qtyChange;
  }

  // 변경될 수량이 0인 경우
  else if (newQty <= 0) {
    itemElem.remove();
    prod.qty -= qtyChange;
  }

  // 변경될 수량이 0보다 작은 경우
  else {
    showOutOfStockAlert();
  }
};

const handleClickRemoveItem = (itemElem, prod) => {
  const remQty = parseInt(
    itemElem.querySelector("span").textContent.split("x ")[1],
  );
  prod.qty += remQty;
  itemElem.remove();
};

const showOutOfStockAlert = () => alert("재고가 부족합니다.");
