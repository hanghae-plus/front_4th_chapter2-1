import { describe } from 'vitest';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../main.advanced';


describe('advanced test', () => {
  it('App 컴포넌트가 정상적으로 렌더링 되는지 확인', () => {
    const rootElement = document.createElement('div');
    rootElement.setAttribute('id', 'app');
    document.body.appendChild(rootElement);

    expect(() => {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    }).not.toThrow();
  });
})