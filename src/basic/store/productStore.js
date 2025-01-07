// 상품 관련 상태 관리
let products = [];

export const productStore = {
  // getters
  getProducts: () => products,
  getProductById: (id) => products.find((p) => p.id === id),

  // setters
  setProducts: (newProducts) => {
    products = newProducts;
  },
};
