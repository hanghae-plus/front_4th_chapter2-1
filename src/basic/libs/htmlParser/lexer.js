import { ERROR } from '../../constants';
import { Component } from './Component';
import { parseAttributes } from './parseAttributes';

/*
 * HTML을 분석해서, 태그토큰과 텍스트 토큰을 생성
 * 태그 토큰(tag tokens): 시작 태그(startTag)와 종료 태그(endTag)
 * 텍스트 토큰(text tokens): 태그 사이의 텍스트 내용
 */
const tokenize = html => {
  const tokens = [];
  const tagRegex = /<\/?([a-zA-Z0-9:-]+)([^>]*)>/g; // 태그 매칭 정규식 -> 매칭되는 요소의 문자열 캡쳐 그룹에 저장
  let lastIndex = 0;
  let match; // 정규 표현식 매칭된 결과 저장

  // 내부적으로 lastIndex를 사용하여 문자열을 탐색하면서 매칭되는 문자열을 찾음
  while ((match = tagRegex.exec(html)) !== null) {
    const [fullMatch, tagName, attrString] = match;
    const tagStartIndex = match.index;

    // 텍스트 노드 처리
    if (tagStartIndex > lastIndex) {
      const text = html.substring(lastIndex, tagStartIndex);
      tokens.push({ type: 'text', content: text });
    }

    if (fullMatch.startsWith('</')) {
      // 종료 태그
      tokens.push({ type: 'endTag', name: tagName.toLowerCase() });
    } else {
      // 시작 태그 또는 자체 닫힘 태그
      const selfClosing = fullMatch.endsWith('/>');
      const attributes = parseAttributes(attrString);
      tokens.push({
        type: 'startTag',
        name: tagName.toLowerCase(),
        attributes,
        selfClosing,
      });
    }

    lastIndex = tagRegex.lastIndex;
  }

  // 마지막 텍스트 노드 처리
  if (lastIndex < html.length) {
    const text = html.substring(lastIndex);
    tokens.push({ type: 'text', content: text });
  }

  return tokens;
};

export const lexer = (htmlString, placeholders, expressions) => {
  const tokens = tokenize(htmlString);
  if (tokens.length === 0) {
    throw new Error(ERROR.EMPTY_HTML_STRING);
  }

  const stack = [];
  const root = new Component({ type: 'root', props: {}, children: [] });
  stack.push(root);

  tokens.forEach(token => {
    if (token.type === 'startTag') {
      // 시작 태그
      const props = {};

      for (const [attrName, attrValue] of Object.entries(token.attributes)) {
        if (typeof attrValue === 'object' && attrValue.type === 'expression') {
          const exprIndex = attrValue.value;
          props[attrName] = expressions[exprIndex];
        } else {
          // 플레이스홀더가 아닌 경우
          props[attrName] = attrValue;
        }
      }

      const newComponent = new Component({
        type: token.name,
        props: props,
        children: [],
      });
      stack[stack.length - 1].children.push(newComponent);
      newComponent.parent = stack[stack.length - 1];

      if (!token.selfClosing) {
        stack.push(newComponent);
      }
    } else if (token.type === 'endTag') {
      // 종료 태그
      if (stack.length === 1 || stack[stack.length - 1].type !== token.name) {
        throw new Error(ERROR.MALFORMED_HTML);
      }
      stack.pop();
    } else if (token.type === 'text') {
      // 텍스트 노드
      const text = token.content.trim();
      if (text === '') return; // 공백 텍스트 무시

      // 플레이스홀더인 경우
      const placeholderMatch = text.match(/^___expr(\d+)___$/);
      if (placeholderMatch) {
        const exprIndex = parseInt(placeholderMatch[1], 10);
        const expr = expressions[exprIndex];
        if (typeof expr === 'string' || typeof expr === 'number') {
          const textComponent = new Component({
            type: 'text',
            props: { value: expr.toString() },
            children: [],
          });
          stack[stack.length - 1].children.push(textComponent);
        } else if (typeof expr === 'function') {
          // 텍스트 노드 내에 함수는 올바르지 않으므로 에러 발생
          throw new Error(
            '텍스트 노드 내에 함수 표현식이 올바르게 사용되지 않았습니다.'
          );
        } else {
          throw new Error(ERROR.INVALID_TAGGED_TEMPLATE_TYPE);
        }
      } else {
        // 일반 텍스트
        const textComponent = new Component({
          type: 'text',
          props: { value: text },
          children: [],
        });
        stack[stack.length - 1].children.push(textComponent);
      }
    }
  });

  if (stack.length !== 1) {
    throw new Error(ERROR.MALFORMED_HTML);
  }

  return root.children[0]; // 루트 컴포넌트 제외
};
