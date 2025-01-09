export const createStore = <T>(initialState: T) => {
  let state = initialState;
  const listeners: Function[] = [];

  const getState = () => state;

  const subscribe = (listener: Function) => {
    listeners.push(listener);

    return () => {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  };

  const setState = (newState: T) => {
    state = newState;
    listeners.forEach((listener) => listener());
  };

  return {
    getState,
    setState,
    subscribe,
  };
};
