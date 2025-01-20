import React from 'react'; // React import 추가
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { App } from '../src/App';

describe('advanced test', () => {
  it('초기 상태: 상품 목록이 올바르게 렌더링 되는지 확인', () => {
    render(<App />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });
});
