import { createAddButtonElement } from './addButton';
import { createCartItemsElement } from './cartItems';
import { createCartTotalElement } from './cartTotal';
import { createHeaderElement } from './header';
import { createProductSelectElement } from './productSelect';
import { createStockStatusElement } from './stockStatus';
import { CART_ITEMS } from '../store/cartItems';
import { PRODUCT_LIST } from '../store/productList';

export const createWrapElement = () => {
  const $wrap = document.createElement('div');
  $wrap.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  const $header = createHeaderElement();
  const $cartItems = createCartItemsElement({
    cartItems: CART_ITEMS,
    productList: PRODUCT_LIST,
  });
  const $cartTotal = createCartTotalElement();
  const $productSelect = createProductSelectElement();
  const $addButton = createAddButtonElement({
    cartItems: CART_ITEMS,
    productList: PRODUCT_LIST,
  });
  const $stockStatus = createStockStatusElement();

  $wrap.appendChild($header);
  $wrap.appendChild($cartItems);
  $wrap.appendChild($cartTotal);
  $wrap.appendChild($productSelect);
  $wrap.appendChild($addButton);
  $wrap.appendChild($stockStatus);

  return $wrap;
};
