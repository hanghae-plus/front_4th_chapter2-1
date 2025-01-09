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
