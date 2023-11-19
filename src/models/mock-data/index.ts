import type { Pots, Sessions } from '@prisma/client';

export function createMockSession(options: Partial<Sessions> = {}): Sessions {
  return {
    id: 1,
    pot_id: 1,
    user_id: '1',
    amount: 100,
    total: 1100,
    top_ups_total: 0,
    likes: 0,
    transaction_type: 'cash_game',
    session_length: 100,
    chop_split: null,
    created_at: new Date('2022-01-01'),
    location: null,
    ...options,
  };
}

export function createMockPot(options: Partial<Pots> = {}): Pots {
  return {
    id: 1,
    name: 'pot',
    owner: '1',
    float: 100,
    created_at: new Date('2022-01-01'),
    ...options,
  };
}
