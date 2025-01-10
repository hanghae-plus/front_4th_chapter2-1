export const createState = (initialValue) => {
  const subscribers = new Set();

  let state = initialValue;

  const getValue = () => state;

  const setValue = (newValue) => {
    state = newValue;
    subscribers.forEach((callback) => callback(state));
  };

  const subscribe = (callback) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  };

  return [getValue, setValue, subscribe];
};
