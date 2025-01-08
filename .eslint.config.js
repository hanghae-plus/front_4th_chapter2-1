// .eslint.config.js
import eslintConfigAirbnbBase from 'eslint-config-airbnb-base';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // Airbnb Base 설정 확장
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // 추가적인 파싱 옵션이 필요하면 여기에 추가
    },
    plugins: {
      import: eslintPluginImport,
      prettier: eslintPluginPrettier,
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.json'],
        },
      },
    },
    rules: {
      // Airbnb 규칙을 포함
      ...eslintConfigAirbnbBase.rules,

      // Prettier 규칙 적용
      'prettier/prettier': ['error'],

      // 팀 컨벤션 적용
      // 함수명, 변수명, 인자명: camelCase enforced
      camelcase: ['error', { properties: 'always' }],

      // 함수명은 동사로 시작 (커스텀 룰 필요)
      // ESLint 기본 규칙으로는 직접적인 제한이 어려우므로, 명명 규칙을 통한 우회
      'id-match': [
        'error',
        '^(cal|find|get|set|update)[A-Z][A-Za-z0-9]+$',
        {
          name: '함수명은 특정 패턴을 따라야 합니다 (예: calCalculate, findPath)',
        },
      ],

      // 인수 객체 형태 사용 권장
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

      // 기타 팀 컨벤션에 맞는 규칙 추가
      // 예: 타입 컨벤션, 함수 선언 컨벤션 등
      // 필요 시 커스텀 룰을 추가하거나, 추가적인 플러그인을 사용
    },
  },

  // Prettier 구성 확장 (eslint-config-prettier)
  {
    files: ['**/*.js'],
    rules: {
      ...eslintConfigPrettier.rules,
    },
  },
];
