// @ts-check
import { createObserver } from './createObserver';

/** @typedef {import('../types').AnyObject} AnyObject */
/** @typedef {import('./createObserver').Subscribe} Subscribe */

/**
 * @template {AnyObject} TState
 * @callback Get
 * @returns {TState}
 */

/**
 * @template {AnyObject} TState
 * @callback Set
 * @param {((prevState: TState) => TState) | TState} nextState
 * @returns {void}
 */

/**
 * @template {AnyObject} TState
 * @param {(get: Get<TState>, set: Set<TState>) => TState} createState
 * @returns {TState}
 */
export const createStore = (createState) => {
  const { publish } = createObserver();

  /** @type {TState} */
  let state;

  const getState = () => {
    return { ...state };
  };

  /**
   * @type {Set<TState>}
   * @returns {void}
   */
  const setState = (nextState) => {
    const result = typeof nextState === 'function' ? nextState(state) : nextState;

    if (!Object.is(result, state)) {
      state = { ...state, ...result };
      publish();
    }
  };

  state = createState(getState, setState);

  return { ...state };
};
