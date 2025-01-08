export const handleClickCart = (event, productList) => {
  const tgt = event.target;
  if (
    !tgt.classList.contains('quantity-change') &&
    !tgt.classList.contains('remove-item')
  )
    return;

  const prodId = tgt.dataset.productId;
  const itemElem = document.getElementById(prodId);
  const prod = productList.find((p) => p.id === prodId);

  if (tgt.classList.contains('quantity-change')) {
    handleClickQtyChange(itemElem, prod, tgt);
  } else if (tgt.classList.contains('remove-item')) {
    handleClickRemoveItem(itemElem, prod);
  }
};

const handleClickQtyChange = (itemElem, prod, tgt) => {
  const qtyChange = parseInt(tgt.dataset.change);
  const curQty = parseInt(
    itemElem.querySelector('span').textContent.split('x ')[1],
  );
  const newQty = curQty + qtyChange;

  // 변경될 수량이 0보다 큰 경우
  if (newQty > 0 && newQty <= prod.qty + curQty) {
    itemElem.querySelector('span').textContent = `${
      itemElem.querySelector('span').textContent.split('x ')[0]
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
    itemElem.querySelector('span').textContent.split('x ')[1],
  );
  prod.qty += remQty;
  itemElem.remove();
};

const showOutOfStockAlert = () => alert('재고가 부족합니다.');
