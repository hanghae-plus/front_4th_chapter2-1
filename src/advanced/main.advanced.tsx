import { createRoot } from 'react-dom/client';
import App from './App';

document.addEventListener('DOMContentLoaded', () => {
	const rootElement = document.getElementById('app');
	if (!rootElement) {
		throw new Error('Root container not found');
	}
	const root = createRoot(rootElement);
	root.render(<App />);
});
