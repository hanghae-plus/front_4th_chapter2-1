import { createRoot } from 'react-dom/client';
import App from './src/App';

function main() {
  const root = createRoot(document.getElementById('app')!);
	root.render(<App />);
}

main();