import { Store } from '.';

/**
 * 상품 정보를 관리하는 스토어
 */
export class ProductStore extends Store {
  constructor() {
    super();
    this.state = {
      products: [
        { id: 'p1', name: '상품1', price: 10_000, quantity: 50 },
        { id: 'p2', name: '상품2', price: 20_000, quantity: 30 },
        { id: 'p3', name: '상품3', price: 30_000, quantity: 20 },
        { id: 'p4', name: '상품4', price: 15_000, quantity: 0 },
        { id: 'p5', name: '상품5', price: 25_000, quantity: 10 },
      ],
    };
  }

  /**
   * 현재 상태의 깊은 복사본 반환
   */
  getState() {
    return {
      products: [...this.state.products],
    };
  }

  /**
   * 싱글톤 인스턴스 반환
   */
  static getInstance() {
    if (!ProductStore.instance) {
      ProductStore.instance = new ProductStore();
    }
    return ProductStore.instance;
  }
}
