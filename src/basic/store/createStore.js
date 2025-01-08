export const createStore = (initialState) => {
  const state = { ...initialState };

  // Q. 해당 메소드들도 한번 더 별도로 관리하는게 좋을까 ?
  const listeners = new Map();
  const hasListeners = (key) => listeners.has(key);
  const getListeners = (key) => listeners.get(key);
  const initializeListeners = (key) => {
    if (!hasListeners(key)) listeners.set(key, []);
  };

  const getState = (key) => state[key];
  const setState = (key, value) => {
    state[key] = value;

    if (hasListeners(key)) {
      const callbacks = getListeners(key);
      callbacks.forEach((callback) => callback(value));
    }
  };

  const subscribe = (key, callback) => {
    initializeListeners(key);
    const callbacks = getListeners(key);
    callbacks.push(callback);
  };

  return { get: getState, set: setState, subscribe };
};
