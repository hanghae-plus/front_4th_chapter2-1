import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import compat from 'eslint-plugin-compat';
import jest from 'eslint-plugin-jest';
import node from 'eslint-plugin-node';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

export default [
  {
    ignores: [
      '**/node_modules/**',
      'dist/**',
      'build/',
      '.cache/',
      '*.lock',
      'README.md',
      '.github/',
      '**/main.original.js',
    ],
  },
  sonarjs.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
      react,
      'react-hooks': reactHooks,
      '@typescript-eslint': typescript,
      compat,
      jest,
      security,
      unicorn,
      node,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Prettier 통합 규칙
      'prettier/prettier': 'error', // Prettier 포맷팅 오류를 ESLint 에러로 표시

      // React 관련 규칙
      'react/prop-types': 'off', // TypeScript 사용 시 prop-types 검사를 비활성화
      'react/react-in-jsx-scope': 'off', // React 17+에서는 필요 없음
      'react-hooks/rules-of-hooks': 'error', // 훅 사용 시 규칙 강제
      'react-hooks/exhaustive-deps': 'warn', // useEffect 의존성 배열 검증

      // TypeScript 관련 규칙
      '@typescript-eslint/no-explicit-any': 'warn', // any 사용 최소화
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' }, // 사용하지 않는 변수 중 '_'로 시작하는 인자는 무시
      ],

      // 최신 JavaScript 스타일 규칙
      'prefer-const': 'error', // 가능하면 const 사용
      'no-var': 'error', // var 사용 금지
      'arrow-body-style': ['error', 'as-needed'], // 필요할 때만 중괄호 사용
      'object-shorthand': 'error', // 객체 속성 단축 표기법 사용
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }], // 빈 줄 제한

      // 코드 안전성 및 문제 방지
      eqeqeq: ['error', 'always'], // 항상 === 사용
      'no-console': ['warn', { allow: ['warn', 'error'] }], // console.log는 경고
      'no-debugger': 'warn', // 디버거 사용 경고
      'no-unused-vars': 'off', // TypeScript 규칙으로 대체
      'no-undef': 'off', // TypeScript 환경에서 처리

      // Test (Jest) 관련 규칙
      'jest/no-disabled-tests': 'warn', // 비활성화된 테스트 경고
      'jest/no-focused-tests': 'error', // 단일 테스트 실행 방지
      'jest/no-identical-title': 'error', // 동일 제목 테스트 방지
      'jest/prefer-to-have-length': 'warn', // `.length` 확인 권장
      'jest/valid-expect': 'error', // 올바른 `expect` 사용 보장

      // 브라우저 호환성 (Compat) 규칙
      'compat/compat': 'warn', // 브라우저 호환성 문제 경고

      // 보안 관련 규칙 (Security)
      'security/detect-object-injection': 'warn', // 객체 속성 주입 방지
      'security/detect-non-literal-require': 'warn', // 동적 require 경고
      'security/detect-eval-with-expression': 'error', // eval 사용 금지

      // 코드 품질 향상 (SonarJS)
      'sonarjs/cognitive-complexity': 'warn', // 복잡도 제한
      'sonarjs/no-identical-expressions': 'warn', // 동일한 표현식 방지
      'sonarjs/pseudo-random': 'warn', // 난수 사용 경고

      // 모던 JavaScript (Unicorn)
      'unicorn/prefer-module': 'error', // ESM 모듈 사용
      'unicorn/prefer-ternary': 'error', // 삼항 연산자 권장
      'unicorn/prefer-node-protocol': 'error', // Node.js URL 모듈 프로토콜 사용
    },
  },
  prettier, // Prettier 충돌 방지
];
