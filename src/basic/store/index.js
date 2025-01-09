/**
 * 전역 상태 관리를 위한 스토어
 */
export class Store {
  constructor() {
    this.observers = new Set();
  }

  /**
   * 옵저버 등록
   * @param {Object} observer update 메서드를 가진 객체
   * @returns {Function} 구독 취소 함수
   */
  subscribe(observer) {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  /**
   * 모든 옵저버에게 데이터 전파
   * @param {any} data 전달할 데이터
   */
  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }

  /**
   * 현재 상태를 반환하는 메서드 (하위 클래스에서 구현)
   */
  getState() {
    throw new Error('getState() must be implemented');
  }
}
