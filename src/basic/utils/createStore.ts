import { createObserver } from './createObserver';

type Store<S, A> = {
  state: S;
  actions: A;
  subscribe: (fn: () => void) => void;
};

export const createStore = <S, A>(initialState: S, actions: (state: S, notify: () => void) => A): Store<S, A> => {
  const observer = createObserver();
  const state = initialState;

  const boundActions = actions(state, observer.notify);

  return {
    state,
    actions: boundActions,
    subscribe: observer.subscribe,
  };
};
