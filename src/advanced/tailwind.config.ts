/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html', // HTML 파일
    './src/**/*.{js,ts,jsx,tsx}', // JS/TS/React 파일
  ],
  theme: {
    extend: {}, // 커스텀 테마 확장
  },
  plugins: [], // 필요한 플러그인 추가 가능
};
