// 속성 파싱 함수 정의
export const parseAttributes = attrString => {
  const attrs = {};
  const attrRegex =
    /([a-zA-Z0-9-:]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/g; // GPT를 활용 - 속성명 규칙에 따라서 매핑되는 정규 표현식 작성 (캡쳐 그룹 이용해서 자동 매칭)
  let match;

  /**
   * 예) class="container"
   *
   *   match[0]: class="container"
   *   match[1]: class (속성 이름)
   *   match[2]: container (쌍따옴표로 감싸진 속성 값)
   *   match[3]: undefined (홑따옴표로 감싸진 속성 값)
   *   match[4]: undefined (따옴표 없는 속성 값)
   *
   */
  while ((match = attrRegex.exec(attrString)) !== null) {
    const attrName = match[1];
    const attrValue = match[2] || match[3] || match[4] || true; // 값이 없으면 true (불리언 속성)

    if (typeof attrValue === 'string') {
      // 플레이스홀더인 경우
      const placeholderMatch = attrValue.match(/^___expr(\d+)___$/);
      if (placeholderMatch) {
        const exprIndex = parseInt(placeholderMatch[1], 10);
        attrs[attrName] = { type: 'expression', value: exprIndex };
        continue;
      }
    }

    // 일반 속성 값
    attrs[attrName] = attrValue;
  }

  return attrs;
};
