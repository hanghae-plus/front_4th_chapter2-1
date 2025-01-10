function isChangedAttributes(oldElement: HTMLElement, newElement: HTMLElement) {
  const newElementAttributes = newElement.attributes;
  const oldElementAttributes = oldElement.attributes;
  if (newElementAttributes.length !== oldElementAttributes.length) {
    return true;
  }

  const changedAttribute = Array.from(oldElementAttributes).find(
    (attribute) => {
      const { name } = attribute;

      const oldAttribute = oldElement.getAttribute(name);
      const newAttribute = newElement.getAttribute(name);
      return newAttribute !== oldAttribute;
    }
  );

  if (changedAttribute) {
    return true;
  }

  return false;
}

export function updateElement(
  parentElement: HTMLElement,
  oldElement: HTMLElement,
  newElement: HTMLElement
) {
  // 새로운 노드가 추가될 경우
  if (!oldElement && newElement) {
    parentElement.appendChild(newElement);
    return;
  }

  // 이전 노드가 삭제된 경우
  if (oldElement && !newElement) {
    oldElement.remove();
    return;
  }

  if (isChangedAttributes(oldElement, newElement)) {
    parentElement.replaceChild(newElement, oldElement);
    return;
  }

  if (
    newElement.children.length === 0 &&
    oldElement.children.length === 0 &&
    newElement.textContent !== oldElement.textContent
  ) {
    oldElement.textContent = newElement.textContent;
    return;
  }

  const oldChildren = Array.from(oldElement.children);
  const newChildren = Array.from(newElement.children);
  const maxChildren = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < maxChildren; i++) {
    updateElement(
      oldElement,
      oldChildren[i] as HTMLElement,
      newChildren[i] as HTMLElement
    );
  }
}

type TemplateValue = string | number | boolean | null | undefined;

export const html = (
  strings: TemplateStringsArray,
  ...values: TemplateValue[]
) => {
  // 값을 문자열로 안전하게 변환하는 헬퍼 함수
  const toSafeString = (value: TemplateValue): string => {
    if (value === null || value === undefined) {
      return "";
    }
    return String(value);
  };

  // 템플릿 문자열과 값들을 결합
  const result: string = strings.reduce(
    (acc: string, str: string, i: number) => {
      const value: string = i < values.length ? toSafeString(values[i]) : "";
      return acc + str + value;
    },
    ""
  );

  // HTML 최소화 과정
  return (
    result
      // 연속된 공백을 단일 공백으로 변환
      .replace(/\s+/g, " ")
      // 태그 시작 부분의 공백 제거
      .replace(/>\s+/g, ">")
      // 태그 종료 부분의 공백 제거
      .replace(/\s+</g, "<")
      // 속성 사이의 다중 공백을 단일 공백으로 변환
      .replace(/\s+/g, " ")
      // 자체 닫는 태그 처리
      .replace(/\s*\/>/g, "/>")
      // 주석 내부 공백 제거
      .replace(/<!--\s*(.*?)\s*-->/g, "<!--$1-->")
      // 시작과 끝의 공백 제거
      .trim()
  );
};
