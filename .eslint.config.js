// .eslint.config.js
import eslintConfigAirbnbBase from 'eslint-config-airbnb-base';
import eslintConfigAirbnbTypescript from 'eslint-config-airbnb-typescript';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintConfigPrettier from 'eslint-config-prettier';
import typeScriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typeScriptEslintParser from '@typescript-eslint/parser';

export default [
  // 1) JavaScript & TypeScript + React
  {
    // 파일 확장자 범위를 한 번에 지정 (JS, TS, JSX, TSX)
    files: ['**/*.{js,jsx,ts,tsx}'],

    // TS 파일을 파싱하려면 parser 설정이 필요
    // (.js/.jsx도 함께 파싱 가능)
    parser: typeScriptEslintParser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // TS 프로젝트 설정을 ESLint가 함께 해석하려면 tsconfig.json 경로 지정 (선택)
      // project: './tsconfig.json',
    },

    // 실행 환경
    env: {
      browser: true,
      node: true,
      es2022: true,
    },

    // 사용 플러그인 등록
    plugins: {
      '@typescript-eslint': typeScriptEslintPlugin,
      import: eslintPluginImport,
      prettier: eslintPluginPrettier,
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      'jsx-a11y': eslintPluginJsxA11y,
    },

    // 가져올 룰들의 집합
    // - airbnb-base(기존): JS용
    // - airbnb-typescript: TS 추가
    // - plugin:react, plugin:react-hooks: React 린팅
    // - plugin:jsx-a11y: 접근성 린팅
    // - plugin:@typescript-eslint: TS 린트 권장 세트
    // - plugin:prettier/recommended: Prettier 호환
    extends: [
      'airbnb-base',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended',
      ...eslintConfigAirbnbTypescript.extends, // 'airbnb-typescript/base'와 유사
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],

    // React 버전을 자동 인식하도록 설정
    settings: {
      react: {
        version: 'detect',
      },
      // import/resolver를 통해 확장자 설정
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        },
      },
    },

    // rules: {} 에는 프로젝트 팀 규칙이나 커스텀 컨벤션 추가
    rules: {
      // 1) Airbnb 규칙 상속 (에어비앤비 베이스 룰에 이미 import, etc. 포함)
      //    -> 필요 시 오버라이딩

      // 2) Prettier와 충돌 날 수 있는 규칙은 'prettier/recommended'가 자동 off 해줍니다.

      // 3) 추가 커스텀 (요청 주신 예시 반영)
      'prettier/prettier': ['error'], // Prettier 포맷 위반 시 에러 처리
      camelcase: ['error', { properties: 'always' }],
      'id-match': [
        'error',
        '^(cal|find|get|set|update)[A-Z][A-Za-z0-9]+$',
        {
          name: '함수명은 특정 패턴을 따라야 합니다 (예: calCalculate, findPath, getData 등)',
        },
      ],
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: { object: true },
          AssignmentExpression: { object: true },
        },
        {
          enforceForRenamedProperties: false,
        },
      ],

      // 필요하다면 @typescript-eslint/* 룰도 구체적으로 조정 가능
      // 예시: any 금지, explicit-function-return-type 강제 등
      '@typescript-eslint/no-explicit-any': 'warn',

      // React 린트 관련 추가 조정 예시
      'react/prop-types': 'off', // TS로 프로퍼티 검증 시 prop-types 사용 안 할 경우
    },
  },

  // 2) Prettier 구성 확장 (eslint-config-prettier)
  //    -> .js, .ts, .jsx, .tsx 전부 적용
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      ...eslintConfigPrettier.rules,
    },
  },
];
