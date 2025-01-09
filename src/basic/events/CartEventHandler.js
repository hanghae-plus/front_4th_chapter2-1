import { state } from '../store/globalStore';
import calcCart from '../utils/calcCart';

export const handleAddToCart = () => {
  const prodList = state.get('prodList');
  const cartList = state.get('cartList');
  const selectedId = document.getElementById('product-select').value;

  const selectedProduct = prodList.find((product) => product.id === selectedId);

  if (selectedProduct && selectedProduct.volume > 0) {
    selectedProduct.volume--;

    const existingCartItem = cartList.find(
      (cartItem) => cartItem.id === selectedId
    );

    if (existingCartItem) {
      existingCartItem.volume++;
    } else {
      cartList.push({ ...selectedProduct, volume: 1 });
    }

    state.set('prodList', prodList);
    state.set('cartList', cartList);
  } else {
    alert('재고가 부족합니다.');
  }

  calcCart();
};

export const handleIncreaseItem = (event) => {
  const prodList = state.get('prodList');
  const cartList = state.get('cartList');
  const productId = event.target.getAttribute('data-product-id');

  const selectedProduct = prodList.find((product) => product.id === productId);

  if (selectedProduct.volume > 0) {
    selectedProduct.volume--;

    const existingCartItem = cartList.find(
      (cartItem) => cartItem.id === productId
    );

    if (existingCartItem) {
      existingCartItem.volume++;
    } else {
      cartList.push({ ...selectedProduct, volume: 1 });
    }

    state.set('prodList', prodList);
    state.set('cartList', cartList);
  } else {
    alert('재고가 부족합니다.');
  }

  calcCart();
};

export const handleDecreaseItem = (event) => {
  const prodList = state.get('prodList');
  const cartList = state.get('cartList');
  const productId = event.target.getAttribute('data-product-id');

  const selectedProduct = prodList.find((product) => product.id === productId);
  const cartItem = cartList.find((cartItem) => cartItem.id === productId);

  cartItem.volume--;

  selectedProduct.volume++;

  if (cartItem.volume === 0) {
    const updatedCartList = cartList.filter((item) => item.id !== cartItem.id);
    state.set('cartList', updatedCartList);
  } else {
    state.set('cartList', cartList);
  }

  state.set('prodList', prodList);

  calcCart();
};

export const handleRemoveItem = (event) => {
  const prodList = state.get('prodList');
  const cartList = state.get('cartList');
  const productId = event.target.getAttribute('data-product-id');

  const cartItem = cartList.find((cartItem) => cartItem.id === productId);

  if (!cartItem) {
    alert('장바구니에 해당 상품이 없습니다.');
    return;
  }

  const updatedCartList = cartList.filter((item) => item.id !== productId);

  const selectedProduct = prodList.find((product) => product.id === productId);
  selectedProduct.volume += cartItem.volume;

  state.set('prodList', prodList);
  state.set('cartList', updatedCartList);

  calcCart();
};
