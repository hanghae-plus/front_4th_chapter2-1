import { createRoot } from 'react-dom/client';
import App from './App';

function main() {
  const $root = document.getElementById('app');
  if (!$root) {
    throw new Error('Root element not found');
  }

  const root = createRoot($root);
  return root.render(App());
}

main();
