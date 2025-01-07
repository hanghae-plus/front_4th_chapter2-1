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
  // userInfo: UserInfoType | null;
  cartList: Product[] | null;
  totalPrice: number;
}

interface Actions {
  getCartList: () => Product[] | null;
  getCartItem: (id: string) => Product | undefined;
  addCartItem: (item: Product) => void;
  removeCartItem: (id: string) => void;
}

export const CartStore = (function () {
  const observers: Observer[] = [];

  const state: State = {
    cartList: null,
  };

  function notifyObservers() {
    observers.forEach((observer) => observer.update(state));
  }

  const actions: Actions = {
    getCartList: () => {
      return state.cartList;
    },
    getCartItem: (id: string) => {
      return state.cartList?.find((item) => item.id === id);
    },
    addCartItem: (item: Product) => {
      const newCartList = state.cartList ? state.cartList.concat(item) : [item];

      state.cartList = newCartList;

      // 아이템 추가 로직
      notifyObservers();
    },
    removeCartItem: (id: string) => {
      if (!state.cartList) return;

      state.cartList = state.cartList.filter((item) => item.id !== id);
      // 아이템 제거 로직
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
