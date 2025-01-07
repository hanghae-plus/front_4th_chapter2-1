type Listener<T> = (value: T) => void;

export const createState = <T extends object>(initialData: T) => {
  const data: T = { ...initialData };

  const listeners = new Map<keyof T, Array<Listener<T[keyof T]>>>();

  const get = <K extends keyof T>(key: K): T[K] => {
    return data[key];
  };

  const set = <K extends keyof T>(key: K, value: T[K]): void => {
    data[key] = value;
    if (listeners.has(key)) {
      const callbacks = listeners.get(key);

      callbacks?.forEach((callback) => callback(value));
    }
  };

  const subscribe = (key: keyof T, callback: Listener<T[typeof key]>): void => {
    if (!listeners.has(key)) {
      listeners.set(key, []);
    }
    const callbacks = listeners.get(key) ?? [];

    callbacks.push(callback as Listener<T[keyof T]>);
    listeners.set(key, callbacks);
  };

  return { get, set, subscribe };
};
