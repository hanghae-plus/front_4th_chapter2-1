import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

function main() {
  const $root = document.getElementById('app');
  if (!$root) {
    throw new Error('"app" 요소를 찾을 수 없습니다.');
  }

  const root = createRoot($root);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

main();
