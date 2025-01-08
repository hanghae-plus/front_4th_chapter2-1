export const productsStore = (() => {
  let instance;

  const createStore = () => {
    {
      const PRODUCTS = [
        { id: "p1", name: "상품1", price: 10000, quantity: 50, discount: 0.1 },
        { id: "p2", name: "상품2", price: 20000, quantity: 30, discount: 0.15 },
        { id: "p3", name: "상품3", price: 30000, quantity: 20, discount: 0.2 },
        { id: "p4", name: "상품4", price: 15000, quantity: 0, discount: 0.05 },
        { id: "p5", name: "상품5", price: 25000, quantity: 10, discount: 0.25 },
      ];
      return {
        getProducts: () => PRODUCTS,
      };
    }
  };

  return {
    getInstance: () => {
      if (!instance) {
        instance = createStore();
      }
      return instance;
    },
  };
})();
