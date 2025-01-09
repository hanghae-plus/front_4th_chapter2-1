import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('advanced test', () => {
  it('초기 상태 렌더', () => {
    render(<App />);

    expect(screen.getByText('장바구니')).toBeInTheDocument();
    // expect(screen.queryByTestId('cart-item')).not.toBeInTheDocument();
    // expect(screen.getByTestId('total-amount').textContent).toBe('총액: 0원');
    // expect(screen.getByTestId('bonus-points').textContent).toBe('포인트: 0');
  });
});
