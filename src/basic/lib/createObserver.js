// @ts-check
import { debounce } from './debounce';

/**
 * @callback Listener
 * @returns {void}
 */

/**
 * @callback Unsubscribe
 * @returns {void}
 */

/**
 * @callback Subscribe
 * @param {Listener} listener
 * @returns {Unsubscribe}
 */

/** @returns {{ subscribe: Subscribe; publish: () => void }} */
export const createObserver = (() => {
  /** @type {Set<Listener>} */
  let listeners = new Set();

  /**
   * @param {Listener} listener
   * @returns {Unsubscribe}
   */
  const subscribe = (listener) => {
    const cloned = new Set(listeners);
    cloned.add(listener);
    listeners = cloned;

    return () => {
      const cloned = new Set(listeners);
      cloned.delete(listener);
      listeners = cloned;
    };
  };

  const publish = () => {
    listeners.forEach((listener) => listener());
  };

  return () => ({ subscribe, publish });
})();
