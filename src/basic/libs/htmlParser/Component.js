// Component 클래스 정의
export class Component {
  constructor({ type, props, parent, children }) {
    this.type = type;
    this.props = props;
    this.parent = parent;
    this.children = children;
  }

  // Component를 DOM으로 렌더링
  render() {
    const element = document.createElement(this.type);

    for (const prop in this.props) {
      // 위임이 아닌 컴포넌트 자체에 이벤트 등록 (함수명은 반드시 on으로 시작)
      if (prop.startsWith('on') && typeof this.props[prop] === 'function') {
        const eventType = prop.slice(2).toLowerCase();
        element.addEventListener(eventType, this.props[prop]);
        // <div isCompleted> 와 같이 속성만 있는 경우
      } else if (this.props[prop] === true) {
        element.setAttribute(prop, '');
      } else if (this.props[prop] === false) {
        // 불리언 false는 속성을 무시
      } else {
        element.setAttribute(prop, this.props[prop]);
      }
    }

    if (this.children) {
      this.children.forEach(child => {
        const childElement =
          // 텍스트 노드인 경우는 Component의 인스턴스로 취급하지 않기에 별도 처리
          child instanceof Component
            ? child.render()
            : document.createTextNode(child);
        element.appendChild(childElement);
      });
    }

    return element;
  }
}
