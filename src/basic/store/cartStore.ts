interface Product {
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
}

interface ActionTypes {
  useGetCartList: () => Product[] | null;
  useAddCartItem: () => void;
  useRemoveCartItem: () => void;
}

export const CartStore = (function () {
  const observers: Observer[] = [];

  const state: State = {
    cartList: null,
  };

  function notifyObservers() {
    observers.forEach((observer) => observer.update(state));
  }

  const actions: ActionTypes = {
    useGetCartList: () => {
      return state.cartList;
    },
    useAddCartItem: () => {
      // 아이템 추가 로직
      notifyObservers();
    },
    useRemoveCartItem: () => {
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
