export function createElements(elementProps) {
  if (!elementProps) {
    throw new Error("elementProps is required");
  }

  if (Array.isArray(elementProps)) {
    const parentComponent = document.createDocumentFragment();
    elementProps.forEach((props) => {
      if (!props.tag) {
        throw new Error("tag property is required");
      }

      const element = document.createElement(props.tag);

      // 추가 속성들은 setAttribute를 통해 안전하게 설정
      Object.entries(props).forEach(([key, val]) => {
        if (val !== undefined) {
          element[key] = val;
        }
      });

      parentComponent.appendChild(element);
    });
    return parentComponent;
  } else {
    const element = document.createElement(elementProps.tag);
    Object.entries(elementProps).forEach(([key, val]) => {
      if (val !== undefined && key !== "tag") {
        element[key] = val;
      }
    });
    return element;
  }
}
