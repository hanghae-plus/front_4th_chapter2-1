import { lexer } from './lexer.js';

// 태그드 템플릿 리터럴 함수 정의
export const html = (strings, ...expressions) => {
  const placeholders = expressions.map((_, i) => `___expr${i}___`); // 문자열 내에서 동적으로 들어온 값의 위치를 placeholder로 처리. 이를 통해, 문자열을 조합할 때, 동적 값의 위치를 알 수 있음
  let combinedString = '';

  // 플레이스홀더를 문자열에 삽입
  strings.forEach((str, i) => {
    combinedString += str + (placeholders[i] || '');
  });

  return lexer(combinedString, placeholders, expressions);
};

export const parseElementToComponent = (element, parentComponent = null) => {
  // 속성(attributes)을 props로 변환
  const props = {};

  Array.from(element.attributes).forEach(attr => {
    const { name, value } = attr;

    if (name.startsWith('on') && typeof element[name] === 'function') {
      // 이벤트 핸들러 속성 (예: onClick)
      props[name] = element[name].bind(element);
    } else if (value === '') {
      // 불리언 속성: 값이 없으면 true로 간주
      props[name] = true;
    } else {
      // 일반 속성
      props[name] = value;
    }
  });

  // Component 인스턴스 생성
  const component = new Component({
    type: element.tagName.toLowerCase(),
    props: props,
    parent: parentComponent ? parentComponent.element : null,
    children: [], // 나중에 자식 추가
  });

  // 자식 노드(children) 처리
  const children = Array.from(element.childNodes)
    .map(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        // 자식이 HTMLElement인 경우 재귀적으로 변환
        return parseElementToComponent(child, component);
      } else if (child.nodeType === Node.TEXT_NODE) {
        // 자식이 텍스트 노드인 경우 텍스트 내용 반환
        const text = child.textContent.trim();
        return text !== '' ? text : null;
      }
      return null; // 다른 노드 타입은 무시
    })
    .filter(child => child !== null); // null 값 제거

  // 4. 자식 설정
  component.setChildren(children);

  return component;
};

export const parseComponentById = id => {
  // 엘리먼트 검색
  const element = document.getElementById(id);
  if (!element) {
    console.error(`Element with id "${id}" not found.`);
    return null;
  }

  // 파서 함수를 사용하여 Component로 변환
  const component = parseElementToComponent(element, null);

  return component;
};
