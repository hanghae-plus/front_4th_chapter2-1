// TODO : 나중에 VDOM으로 수정하기
export class Component {
  constructor({ type, props, parent, children }) {
    this.type = type;
    this.props = props;
    this.parent = parent;
    this.children = children;
    this.element = null; // 실제 DOM 요소를 참조
  }

  render() {
    this.element = document.createElement(this.type);

    for (const prop in this.props) {
      if (prop.startsWith('on') && typeof this.props[prop] === 'function') {
        const eventType = prop.slice(2).toLowerCase();

        this.element.addEventListener(eventType, this.props[prop]);
      } else if (this.props[prop] === true) {
        this.element.setAttribute(prop, '');
      } else if (this.props[prop] === false) {
        // 불리언 false는 속성을 무시
      } else {
        this.element.setAttribute(prop, this.props[prop]);
      }
    }

    if (this.children) {
      this.children.forEach(child => {
        const childElement =
          child instanceof Component
            ? child.render()
            : document.createTextNode(child);

        this.element.appendChild(childElement);
      });
    }

    return this.element;
  }

  getChildren() {
    return this.element ? Array.from(this.element.childNodes) : [];
  }

  setChildren(newChildren) {
    this.children = newChildren;
    if (this.element) {
      // 기존 자식 요소 제거
      while (this.element.firstChild) {
        this.element.removeChild(this.element.firstChild);
      }
      // 새로운 자식 요소 추가
      this.children.forEach(child => {
        const childElement =
          child instanceof Component
            ? child.render()
            : document.createTextNode(child);

        this.element.appendChild(childElement);
      });
    }
  }

  setProps(newProps) {
    this.props = { ...this.props, ...newProps };
    if (this.element) {
      for (const prop in newProps) {
        if (prop.startsWith('on') && typeof newProps[prop] === 'function') {
          const eventType = prop.slice(2).toLowerCase();

          this.element.addEventListener(eventType, newProps[prop]);
        } else if (newProps[prop] === true) {
          this.element.setAttribute(prop, '');
        } else if (newProps[prop] === false) {
          this.element.removeAttribute(prop);
        } else {
          this.element.setAttribute(prop, newProps[prop]);
        }
      }
    }
  }

  get(target) {
    if (target === 'children') {
      return this.getChildren();
    }
    if (target === 'props') {
      return this.props;
    }
    if (target === 'element') {
      return this.element;
    }
    if (target === 'parent') {
      return this.element.parentNode;
    }
    if (target === 'type') {
      return this.type;
    }
  }

  // 새로운 update 메서드 (필요 시 확장 가능)
  update({ props = null, children = null }) {
    if (props) {
      this.setProps(props);
    }
    if (children) {
      this.setChildren(children);
    }
  }
}
