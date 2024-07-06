import { formatCurrency } from '../currency';
import { describe, it, expect } from '@jest/globals';

describe('formatCurrency', () => {
  it('formats positive amounts correctly', () => {
    expect(formatCurrency(10)).toBe('£10');
  });

  it('formats negative amounts correctly', () => {
    expect(formatCurrency(-10)).toBe('-£10');
  });
});
