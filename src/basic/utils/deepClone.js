/**
 * 간단한 깊은 복사 함수
 * @description JSON.stringify()와 JSON.parse()를 이용하여 객체를 깊은 복사한다.
 * - 주의
 *   - 객체 타입 지원 범위가 제한적이다. (Date, Function, undefined, Symbol, Map, Set, NaN, Infinity, -Infinity)
 *   - 객체 내부에 순환 참조가 있을 경우 무한 루프에 빠질 수 있다.
 * @param {*} obj
 * @returns
 */
export const deepClone = obj => JSON.parse(JSON.stringify(obj));
