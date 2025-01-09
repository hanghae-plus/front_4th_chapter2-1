// hook 싱글톤 인스턴스
let instance = null;

export function useProducts() {
  if (instance) return instance;

  const initialProducts = [
    { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
  ];

  let products = [...initialProducts];
  let subscribers = new Set();

  const notifySubscribers = () => {
    subscribers.forEach((callback) => callback(products));
  };

  const updateProductPrice = (productId, newPrice) => {
    products = products.map((product) =>
      product.id === productId ? { ...product, price: newPrice } : product,
    );
    notifySubscribers();
  };

  const updateProductQuantity = (productId, newQuantity) => {
    products = products.map((product) =>
      product.id === productId ? { ...product, quantity: newQuantity } : product,
    );
    notifySubscribers();
  };

  const subscribe = (callback) => {
    subscribers.add(callback);
    return () => {
      subscribers.delete(callback);
    };
  };

  instance = {
    getProducts: () => [...products],
    updatePrice: updateProductPrice,
    updateQuantity: updateProductQuantity,
    subscribeProduct: subscribe,
  };

  return instance;
}
