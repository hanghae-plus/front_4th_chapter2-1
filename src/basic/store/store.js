export function createStore(initialState) {
  const state = { ...initialState };
  const listeners = new Set();

  return {
    getState: () => state,
    update: (newState) => {
      Object.assign(state, newState);
      listeners.forEach((listener) => listener(state));
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
