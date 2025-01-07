/**
 * 단일 DOM 요소를 선택하기 위한 헬퍼 함수
 * @param {string} selector - CSS 셀렉터
 * @param {HTMLElement|Document} [context=document] - 탐색 범위 (기본값: document)
 * @returns {HTMLElement | null} - 선택된 첫 번째 요소 (없으면 null)
 */
export const $ = (selector: string, context: HTMLElement | Document = document) => {
  return context.querySelector(selector);
};

/**
 * 복수 DOM 요소를 선택하기 위한 헬퍼 함수
 * @param {string} selector - CSS 셀렉터
 * @param {HTMLElement|Document} [context=document] - 탐색 범위 (기본값: document)
 * @returns {HTMLElement[]} - 선택된 모든 요소를 배열 형태로 반환
 */
export const $$ = (selector: string, context: HTMLElement | Document = document) => {
  return Array.from(context.querySelectorAll(selector));
};
