import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './advanced/main.advanced';


const rootElement = document.getElementById('app');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);