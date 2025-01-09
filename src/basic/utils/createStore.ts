import { createObserver } from './createObserver';

/**
 * 스토어의 기본 타입을 정의합니다.
 * @template S - 스토어의 상태 타입
 * @template A - 스토어의 액션 타입
 */
type Store<S, A> = {
  state: S;
  actions: A;
  subscribe: (fn: () => void) => void;
};

/**
 * @template S - 스토어의 상태 타입
 * @template A - 스토어의 액션 타입
 * @param initialState - 스토어의 초기 상태. 스토어가 생성될 때 사용됩니다.
 * @param actions - 상태를 변경하는 액션들을 정의하는 함수. 상태와 상태 변경 알림 함수를 인자로 받습니다.
 * @returns 생성된 스토어 객체. 상태, 액션, 구독 메서드를 포함합니다.
 * @returns
 */
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
