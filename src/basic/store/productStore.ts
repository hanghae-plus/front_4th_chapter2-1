export interface Product {
  id: string;
  name: string;
  val: number;
  q: number;
}

interface Observer {
  update(state: State): void;
}

interface State {
  productList: Product[] | null;
}

interface Actions {
  getProductList: () => Product[] | null;
  decreaseQ: (id: string) => void;
  increaseQ: (id: string) => void;
}

export const ProductStore = (function () {
  const observers: Observer[] = [];

  const state: State = {
    productList: [
      { id: 'p1', name: '상품1', val: 10000, q: 50 },
      { id: 'p2', name: '상품2', val: 20000, q: 30 },
      { id: 'p3', name: '상품3', val: 30000, q: 20 },
      { id: 'p4', name: '상품4', val: 15000, q: 0 },
      { id: 'p5', name: '상품5', val: 25000, q: 10 },
    ],
  };

  function notifyObservers() {
    observers.forEach((observer) => observer.update(state));
  }

  const actions: Actions = {
    getProductList: () => {
      return state.productList;
    },
    decreaseQ: (id: string) => {
      // id에 해당하는 아이템의 q 값을 1 감소

      const newProductList = state.productList?.map((item) => (item.id === id ? { ...item, q: item.q - 1 } : item));

      state.productList = newProductList || state.productList;

      notifyObservers();
    },
    increaseQ: (id: string) => {
      // id에 해당하는 아이템의 q 값을 1 증가
      const newProductList = state.productList?.map((item) => (item.id === id ? { ...item, q: item.q + 1 } : item));

      state.productList = newProductList || state.productList;

      notifyObservers();
    },
  };

  const observer = {
    addObserver: (observer: Observer) => {
      observers.push(observer);
    },
    removeObserver: (observer: Observer) => {
      const index = observers.indexOf(observer);
      if (index > -1) {
        observers.splice(index, 1);
      }
    },
  };

  return {
    state,
    actions,
    observer,
  };
})();
