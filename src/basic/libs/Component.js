export class Component {
  constructor({ name, props, children }) {
    this.name = name;
    this.props = props;
    this.children = children;
  }

  render() {
    const component = document.createElement(name);

    for (const prop in props) {
      component.setAttribute(prop, props[prop]);
    }

    if (children) {
      children.forEach(child => {
        component.appendChild(child.render());
      });
    }

    return component;
  }
}
