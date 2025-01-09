type EventCallback = (event: Event) => void;
const eventListeners = new Map<string, Set<EventCallback>>();

export const addEventListener = (event: string, callback: EventCallback) => {
  const root = document.getElementById('app');
  if (!root) return;

  // 이전에 등록된 같은 이벤트의 리스너들 제거
  const existingListeners = eventListeners.get(event) || new Set();
  existingListeners.forEach((listener) => {
    root.removeEventListener(event, listener);
  });

  // 새로운 리스너 등록
  root.addEventListener(event, callback);

  // 새로운 리스너 저장
  const newListeners = new Set([callback]);
  eventListeners.set(event, newListeners);
};

// (선택사항) 명시적인 클린업을 위한 함수
export const cleanupEventListeners = () => {
  const root = document.getElementById('app');
  if (!root) return;

  eventListeners.forEach((listeners, event) => {
    listeners.forEach((listener) => {
      root.removeEventListener(event, listener);
    });
  });

  eventListeners.clear();
};
