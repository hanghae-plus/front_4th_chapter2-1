import { useProducts } from './useProduct.js';

// hook 싱글톤 인스턴스
let instance = null;

export function useCart() {
  if (instance) return instance;

  let cart = new Map();
  let lastSelectedId = null;
  let subscribers = new Set();

  const notifySubscribers = () => {
    subscribers.forEach((callback) => callback(cart));
  };

  const addToCart = (productId) => {
    const { getProducts, updateQuantity } = useProducts();
    const products = getProducts();
    const product = products.find((p) => p.id === productId);
    const currentItem = cart.get(productId);

    if (product.quantity <= 0) {
      alert('재고가 부족합니다.');
      return;
    }

    cart.set(productId, {
      product,
      quantity: currentItem ? currentItem.quantity + 1 : 1,
    });
    updateQuantity(productId, product.quantity - 1);
    lastSelectedId = productId;
    notifySubscribers();
  };

  const removeFromCart = (productId) => {
    const { getProducts, updateQuantity } = useProducts();
    const products = getProducts();
    const product = products.find((p) => p.id === productId);
    const item = cart.get(productId);

    updateQuantity(productId, product.quantity + item.quantity);
    cart.delete(productId);
    notifySubscribers();
  };

  const updateItemQuantity = (productId, quantity) => {
    const item = cart.get(productId);

    const newQuantity = item.quantity + quantity;
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      const { getProducts } = useProducts();
      const products = getProducts();
      const product = products.find((p) => p.id === productId);
      if (product.quantity < newQuantity) {
        alert('재고가 부족합니다.');
        return;
      }
      cart.set(productId, { ...item, quantity: newQuantity });
      notifySubscribers();
    }
  };

  const subscribe = (callback) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  };

  instance = {
    getCart: () => cart,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    subscribeCart: subscribe,
  };

  return instance;
}
