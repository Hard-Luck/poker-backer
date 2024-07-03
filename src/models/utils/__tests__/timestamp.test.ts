import {
  convertMinsToHrsMins,
  formatDateStringToLongDate,
  formatDateStringToDDMMYY,
  formatDateStringToDDMM,
  formatDateStringToDDMMHHSS,
  isDateAfter,
} from '../timestamp';

describe('convertMinsToHrsMins', () => {
    test('should return 0m if minutes is 0', () => {
        expect(convertMinsToHrsMins(0)).toBe('0m');
    });
    test('should convert minutes to hours and minutes', () => {
        expect(convertMinsToHrsMins(60)).toBe('1h');
        expect(convertMinsToHrsMins(120)).toBe('2h');
        expect(convertMinsToHrsMins(121)).toBe('2h 1m');
    });
    
});

describe('formatDateStringToLongDate', () => {
    test('should format a date to a long date string when numbers end in "st"', () => {
        const date = new Date('2021-01-01T00:00:00Z');
        expect(formatDateStringToLongDate(date)).toBe('1st of January 2021');
        expect(formatDateStringToLongDate(new Date('2021-02-21T00:00:00Z'))).toBe('21st of February 2021');
        expect(formatDateStringToLongDate(new Date('2021-03-31T00:00:00Z'))).toBe('31st of March 2021');
    });
    test('should format a date to a long date string when numbers end in "nd"', () => {
        expect(formatDateStringToLongDate(new Date('2021-02-02T00:00:00Z'))).toBe('2nd of February 2021');
        expect(formatDateStringToLongDate(new Date('2021-03-22T00:00:00Z'))).toBe('22nd of March 2021');
    });
    test('should format a date to a long date string when numbers end in "rd"', () => {
        expect(formatDateStringToLongDate(new Date('2021-03-03T00:00:00Z'))).toBe('3rd of March 2021');
        expect(formatDateStringToLongDate(new Date('2021-04-23T00:00:00Z'))).toBe('23rd of April 2021');
    });
    test('should format a date to a long date string when numbers end in "th"', () => {
        expect(formatDateStringToLongDate(new Date('2021-04-04T00:00:00Z'))).toBe('4th of April 2021');
        expect(formatDateStringToLongDate(new Date('2021-05-24T00:00:00Z'))).toBe('24th of May 2021');
    });   
    test('should format a date to a long date string when numbers end in "th" and are greater than 10', () => {
        expect(formatDateStringToLongDate(new Date('2021-04-14T00:00:00Z'))).toBe('14th of April 2021');
        expect(formatDateStringToLongDate(new Date('2021-05-15T00:00:00Z'))).toBe('15th of May 2021');
    });
})

describe('formatDateStringToDDMMYY', () => {
    test('should format a date to a long date string with time', () => {
        expect(formatDateStringToDDMMYY(new Date('2021-01-01T00:00:00Z'))).toBe('01-01-2021');
        expect(formatDateStringToDDMMYY(new Date('2021-02-21T00:00:00Z'))).toBe('21-02-2021');
        expect(formatDateStringToDDMMYY(new Date('2021-03-31T00:00:00Z'))).toBe('31-03-2021');
    });
})

describe('formatDateStringToDDMM', () => {
    test('should format a date to a short date string', () => {
        expect(formatDateStringToDDMM(new Date('2021-01-01T00:00:00Z'))).toBe('01-01');
        expect(formatDateStringToDDMM(new Date('2021-02-21T00:00:00Z'))).toBe('21-02');
        expect(formatDateStringToDDMM(new Date('2021-03-31T00:00:00Z'))).toBe('31-03');
    });
})

describe('formatDateStringToDDMMHHSS', () => {
    test('should format a timestamp to a date string', () => {
        expect(formatDateStringToDDMMHHSS('2021-01-01T00:00:00Z')).toBe('01-01 00:00');
        expect(formatDateStringToDDMMHHSS('2021-02-21T01:02:00Z')).toBe('21-02 01:02');
        expect(formatDateStringToDDMMHHSS('2021-03-31T21:32:00Z')).toBe('31-03 21:32');
    });
    test('should ignore seconds', () => {   
        expect(formatDateStringToDDMMHHSS('2021-01-01T00:00:11Z')).toBe('01-01 00:00');
        expect(formatDateStringToDDMMHHSS('2021-02-21T01:02:22Z')).toBe('21-02 01:02');
        expect(formatDateStringToDDMMHHSS('2021-03-31T21:32:31Z')).toBe('31-03 21:32');
    });
})

describe('isDateAfter', () => {
    test('should return true if date1 is after date2', () => {
        const date1 = new Date('2021-01-01T00:00:00Z'); 
        const date2 = new Date('2020-01-02T00:00:00Z');
        expect(isDateAfter(date1, date2)).toBe(true);
    });
    test('should return false if date1 is before date2', () => {
        const date1 = new Date('2020-01-01T00:00:00Z'); 
        const date2 = new Date('2021-01-02T00:00:00Z');
        expect(isDateAfter(date1, date2)).toBe(false);
    });
    test('should return false if date1 is the same as date2', () => {
        const date1 = new Date('2021-01-01T00:00:00Z'); 
        const date2 = new Date('2021-01-01T00:00:00Z');
        expect(isDateAfter(date1, date2)).toBe(false);
    });
})