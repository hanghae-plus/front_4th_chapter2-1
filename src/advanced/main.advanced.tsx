import React from 'react';
import ReactDom from 'react-dom/client';
import App from './App';

const container = document.getElementById('app');

if (!container) {
  throw new Error('Container not found');
}

ReactDom.createRoot(container).render(<App />);
