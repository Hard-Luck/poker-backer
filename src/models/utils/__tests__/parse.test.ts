import { parseAndValidateChopSplit } from '../parse';

describe('parseAndValidateChopSplit', () => {
  it('should parse and validate a chop split string', () => {
    const chopSplit =
      '{"user1": {"split": 1, "percent": 50, "username": "user1"}, "user2": {"split": 2, "percent": 50, "username": "user2"}}';
    expect(parseAndValidateChopSplit(chopSplit)).toEqual({
      user1: { split: 1, percent: 50, username: 'user1' },
      user2: { split: 2, percent: 50, username: 'user2' },
    });
  });
  it('should throw an error if the chop split string is invalid', () => {
    const chopSplit =
      '{"user1": {"split": 1, "percent": 50, "username": "user1"}, "user2": {"split": 2, "percent": 50, "username": "user2"}';
    expect(() => parseAndValidateChopSplit(chopSplit)).toThrow(
      'Could not be parsed and/or validated.'
    );
  });
});
