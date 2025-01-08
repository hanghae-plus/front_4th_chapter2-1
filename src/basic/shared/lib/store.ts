type SetState<T> = (newState: T | ((state: T) => T)) => void;
type GetState<T> = () => T;
type CreateState<T> = (set: SetState<T>, get: GetState<T>) => T;

export type Store<T> = ReturnType<typeof createStore<T>>;

export const createStore = <T>(createState: CreateState<T>) => {
  let state: T;
  const listeners = new Set<() => void>();
  const getState: GetState<T> = () => state;

  const setState: SetState<T> = (newState) => {
    const nextState =
      typeof newState === "function"
        ? (newState as (state: T) => T)(state)
        : newState;

    if (!Object.is(nextState, state)) {
      state = nextState;
      listeners.forEach((listener) => listener());
    }
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  state = createState(setState, getState);

  return {
    subscribe,
    getState,
    setState
  };
};
