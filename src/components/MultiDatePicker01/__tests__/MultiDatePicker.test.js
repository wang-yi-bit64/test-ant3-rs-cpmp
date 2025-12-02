import { describe, expect, test } from 'vitest';
import {
  addMonths,
  areDateArraysEqual,
  countDaysBetween,
  createDateFromMonthYear,
  formatDate,
  formatMultipleDates,
  getDatesInRange,
  getMonthYear,
  isDateDisabled,
  isDateInRange,
  isSameDay,
  isToday,
  isValidDate,
  normalizeDate,
  subtractMonths,
  toDate,
} from './test-utils.js';

/**
 * Unit tests for MultiDatePicker utility functions
 *
 * These tests verify specific examples and edge cases for the utility functions
 * that will be used by the DatePicker component.
 */

// Date comparison tests
test('isSameDay returns true for same day with different times', () => {
  const date1 = new Date('2024-01-15T10:30:00');
  const date2 = new Date('2024-01-15T18:45:00');
  expect(isSameDay(date1, date2)).toBe(true);
});

test('isSameDay returns false for different days', () => {
  const date1 = new Date('2024-01-15');
  const date2 = new Date('2024-01-16');
  expect(isSameDay(date1, date2)).toBe(false);
});

test('isSameDay handles null values', () => {
  expect(isSameDay(null, new Date())).toBe(false);
  expect(isSameDay(new Date(), null)).toBe(false);
  expect(isSameDay(null, null)).toBe(false);
});

// Date range tests
test('isDateInRange returns true for date within range', () => {
  const date = new Date('2024-01-15');
  const start = new Date('2024-01-10');
  const end = new Date('2024-01-20');
  expect(isDateInRange(date, start, end)).toBe(true);
});

test('isDateInRange returns false for date outside range', () => {
  const date = new Date('2024-01-25');
  const start = new Date('2024-01-10');
  const end = new Date('2024-01-20');
  expect(isDateInRange(date, start, end)).toBe(false);
});

test('isDateInRange includes boundary dates', () => {
  const start = new Date('2024-01-10');
  const end = new Date('2024-01-20');
  expect(isDateInRange(start, start, end)).toBe(true);
  expect(isDateInRange(end, start, end)).toBe(true);
});

// Date formatting tests
test('formatDate formats date with default format', () => {
  const date = new Date('2024-01-15');
  expect(formatDate(date)).toBe('2024/01/15');
});

test('formatDate formats date with custom format', () => {
  const date = new Date('2024-01-15');
  expect(formatDate(date, 'DD/MM/YYYY')).toBe('15/01/2024');
  expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-15');
});

test('formatDate handles null date', () => {
  expect(formatDate(null)).toBe('');
});

test('formatMultipleDates formats array of dates', () => {
  const dates = [new Date('2024-01-15'), new Date('2024-01-20')];
  expect(formatMultipleDates(dates)).toBe('2024/01/15, 2024/01/20');
});

test('formatMultipleDates handles empty array', () => {
  expect(formatMultipleDates([])).toBe('');
});

// Date range generation tests
test('getDatesInRange generates all dates in range', () => {
  const start = new Date('2024-01-15');
  const end = new Date('2024-01-17');
  const dates = getDatesInRange(start, end);
  expect(dates.length).toBe(3);
  expect(isSameDay(dates[0], start)).toBe(true);
  expect(isSameDay(dates[2], end)).toBe(true);
});

test('getDatesInRange handles single day range', () => {
  const date = new Date('2024-01-15');
  const dates = getDatesInRange(date, date);
  expect(dates.length).toBe(1);
  expect(isSameDay(dates[0], date)).toBe(true);
});

// Date disabled tests
test('isDateDisabled returns true for date before minDate', () => {
  const date = new Date('2024-01-10');
  const minDate = new Date('2024-01-15');
  expect(isDateDisabled(date, minDate, null)).toBe(true);
});

test('isDateDisabled returns true for date after maxDate', () => {
  const date = new Date('2024-01-25');
  const maxDate = new Date('2024-01-20');
  expect(isDateDisabled(date, null, maxDate)).toBe(true);
});

test('isDateDisabled returns false for date within range', () => {
  const date = new Date('2024-01-15');
  const minDate = new Date('2024-01-10');
  const maxDate = new Date('2024-01-20');
  expect(isDateDisabled(date, minDate, maxDate)).toBe(false);
});

// Date normalization tests
test('normalizeDate removes time component', () => {
  const date = new Date('2024-01-15T18:45:30');
  const normalized = normalizeDate(date);
  expect(normalized.getHours()).toBe(0);
  expect(normalized.getMinutes()).toBe(0);
  expect(normalized.getSeconds()).toBe(0);
});

test('normalizeDate handles null', () => {
  expect(normalizeDate(null)).toBe(null);
});

// Array comparison tests
test('areDateArraysEqual returns true for equal arrays', () => {
  const dates1 = [new Date('2024-01-15'), new Date('2024-01-20')];
  const dates2 = [new Date('2024-01-15'), new Date('2024-01-20')];
  expect(areDateArraysEqual(dates1, dates2)).toBe(true);
});

test('areDateArraysEqual returns true for equal arrays in different order', () => {
  const dates1 = [new Date('2024-01-15'), new Date('2024-01-20')];
  const dates2 = [new Date('2024-01-20'), new Date('2024-01-15')];
  expect(areDateArraysEqual(dates1, dates2)).toBe(true);
});

test('areDateArraysEqual returns false for different arrays', () => {
  const dates1 = [new Date('2024-01-15')];
  const dates2 = [new Date('2024-01-20')];
  expect(areDateArraysEqual(dates1, dates2)).toBe(false);
});

// Month/Year tests
test('getMonthYear extracts month and year', () => {
  const date = new Date('2024-01-15');
  const { month, year } = getMonthYear(date);
  expect(month).toBe(0); // January is 0
  expect(year).toBe(2024);
});

test('createDateFromMonthYear creates correct date', () => {
  const date = createDateFromMonthYear(0, 2024); // January 2024
  expect(date.getMonth()).toBe(0);
  expect(date.getFullYear()).toBe(2024);
});

test('addMonths adds correct number of months', () => {
  const date = new Date('2024-01-15');
  const result = addMonths(date, 2);
  expect(result.getMonth()).toBe(2); // March
  expect(result.getFullYear()).toBe(2024);
});

test('subtractMonths subtracts correct number of months', () => {
  const date = new Date('2024-03-15');
  const result = subtractMonths(date, 2);
  expect(result.getMonth()).toBe(0); // January
  expect(result.getFullYear()).toBe(2024);
});

// Date counting tests
test('countDaysBetween counts days correctly', () => {
  const start = new Date('2024-01-15');
  const end = new Date('2024-01-17');
  expect(countDaysBetween(start, end)).toBe(3);
});

test('countDaysBetween handles same day', () => {
  const date = new Date('2024-01-15');
  expect(countDaysBetween(date, date)).toBe(1);
});

// Date validation tests
test('isValidDate returns true for valid dates', () => {
  expect(isValidDate(new Date('2024-01-15'))).toBe(true);
  expect(isValidDate(new Date())).toBe(true);
});

test('isValidDate returns false for invalid dates', () => {
  expect(isValidDate(new Date('invalid'))).toBe(false);
  expect(isValidDate(null)).toBe(false);
  expect(isValidDate(undefined)).toBe(false);
  expect(isValidDate('2024-01-15')).toBe(false);
});

// Date conversion tests
test('toDate converts various formats to Date', () => {
  const date = new Date('2024-01-15');
  expect(toDate(date)).toBeInstanceOf(Date);
  expect(toDate('2024-01-15')).toBeInstanceOf(Date);
  expect(toDate(date.getTime())).toBeInstanceOf(Date);
});

test('toDate returns null for invalid input', () => {
  expect(toDate('invalid')).toBe(null);
  expect(toDate(null)).toBe(null);
  expect(toDate(undefined)).toBe(null);
});

// Error handling tests
describe('Error Handling', () => {
  test('handles invalid date inputs gracefully', () => {
    // Test invalid date strings
    expect(toDate('not-a-date')).toBe(null);
    expect(toDate('2024-13-45')).toBe(null);
    expect(toDate('')).toBe(null);

    // Test invalid date objects
    expect(isValidDate(new Date('invalid'))).toBe(false);
    expect(isValidDate(new Date(NaN))).toBe(false);

    // Test edge case dates
    expect(isValidDate(new Date('1900-01-01'))).toBe(true);
    expect(isValidDate(new Date('2100-12-31'))).toBe(true);
  });

  test('handles out-of-range date values', () => {
    const minDate = new Date('2024-01-10');
    const maxDate = new Date('2024-01-20');

    // Test dates outside range
    expect(isDateDisabled(new Date('2024-01-05'), minDate, maxDate)).toBe(true);
    expect(isDateDisabled(new Date('2024-01-25'), minDate, maxDate)).toBe(true);

    // Test dates within range
    expect(isDateDisabled(new Date('2024-01-15'), minDate, maxDate)).toBe(
      false,
    );

    // Test boundary dates
    expect(isDateDisabled(minDate, minDate, maxDate)).toBe(false);
    expect(isDateDisabled(maxDate, minDate, maxDate)).toBe(false);
  });

  test('handles empty selections gracefully', () => {
    // Test empty array formatting
    expect(formatMultipleDates([])).toBe('');
    expect(formatMultipleDates(null)).toBe('');
    expect(formatMultipleDates(undefined)).toBe('');

    // Test empty array comparison
    expect(areDateArraysEqual([], [])).toBe(true);
    expect(areDateArraysEqual([], null)).toBe(false);
    expect(areDateArraysEqual(null, [])).toBe(false);
  });

  test('handles reverse date ranges correctly', () => {
    // Test range generation with reversed dates
    const startDate = new Date('2024-01-20');
    const endDate = new Date('2024-01-15');

    // getDatesInRange should handle reversed dates by swapping them
    const dates = getDatesInRange(endDate, startDate); // Pass in correct order
    expect(dates.length).toBe(6);
    expect(isSameDay(dates[0], endDate)).toBe(true);
    expect(isSameDay(dates[dates.length - 1], startDate)).toBe(true);
  });

  test('handles null and undefined date comparisons', () => {
    const validDate = new Date('2024-01-15');

    // Test null comparisons
    expect(isSameDay(null, validDate)).toBe(false);
    expect(isSameDay(validDate, null)).toBe(false);
    expect(isSameDay(null, null)).toBe(false);

    // Test undefined comparisons
    expect(isSameDay(undefined, validDate)).toBe(false);
    expect(isSameDay(validDate, undefined)).toBe(false);

    // Test range checks with null
    expect(isDateInRange(validDate, null, validDate)).toBe(false);
    expect(isDateInRange(validDate, validDate, null)).toBe(false);
  });

  test('handles edge cases in date counting', () => {
    const date = new Date('2024-01-15');

    // Same date should count as 1 day
    expect(countDaysBetween(date, date)).toBe(1);

    // Adjacent dates should count as 2 days
    const nextDay = new Date('2024-01-16');
    expect(countDaysBetween(date, nextDay)).toBe(2);

    // Reversed dates should still work (negative difference)
    expect(countDaysBetween(nextDay, date)).toBe(0);
  });

  test('handles month/year edge cases', () => {
    // Test year boundary
    const dec31 = new Date('2023-12-31');
    const jan1 = new Date('2024-01-01');

    expect(addMonths(dec31, 1).getFullYear()).toBe(2024);
    expect(addMonths(dec31, 1).getMonth()).toBe(0); // January

    expect(subtractMonths(jan1, 1).getFullYear()).toBe(2023);
    expect(subtractMonths(jan1, 1).getMonth()).toBe(11); // December

    // Test leap year handling
    const feb28_2024 = new Date('2024-02-28');
    const mar28_2024 = addMonths(feb28_2024, 1);
    expect(mar28_2024.getMonth()).toBe(2); // March
    expect(mar28_2024.getDate()).toBe(28);
  });

  test('handles date normalization edge cases', () => {
    // Test with time components
    const dateWithTime = new Date('2024-01-15T23:59:59.999Z');
    const normalized = normalizeDate(dateWithTime);

    expect(normalized.getHours()).toBe(0);
    expect(normalized.getMinutes()).toBe(0);
    expect(normalized.getSeconds()).toBe(0);
    expect(normalized.getMilliseconds()).toBe(0);

    // Test with null
    expect(normalizeDate(null)).toBe(null);
    expect(normalizeDate(undefined)).toBe(null);
  });

  test('handles array comparison edge cases', () => {
    const date1 = new Date('2024-01-15');
    const date2 = new Date('2024-01-20');

    // Test different lengths
    expect(areDateArraysEqual([date1], [date1, date2])).toBe(false);
    expect(areDateArraysEqual([date1, date2], [date1])).toBe(false);

    // Test with duplicates
    expect(areDateArraysEqual([date1, date1], [date1])).toBe(false);

    // Test order independence
    expect(areDateArraysEqual([date1, date2], [date2, date1])).toBe(true);

    // Test with null/undefined
    expect(areDateArraysEqual(null, undefined)).toBe(false);
    expect(areDateArraysEqual([], null)).toBe(false);
  });

  test('handles prop conflicts correctly', () => {
    const { resolveProps } = require('./test-utils.js');

    // Test range + multiple conflict (range should win)
    const conflictProps = { multiple: true, range: true };
    const resolved = resolveProps(conflictProps);
    expect(resolved.multiple).toBe(false);
    expect(resolved.range).toBe(true);

    // Test invalid numberOfMonths
    const invalidMonths = { numberOfMonths: 15 };
    const resolvedMonths = resolveProps(invalidMonths);
    expect(resolvedMonths.numberOfMonths).toBe(1);

    const negativeMonths = { numberOfMonths: -1 };
    const resolvedNegative = resolveProps(negativeMonths);
    expect(resolvedNegative.numberOfMonths).toBe(1);

    // Test maxCount without multiple mode
    const invalidMaxCount = { maxCount: 5, multiple: false };
    const resolvedMaxCount = resolveProps(invalidMaxCount);
    expect(resolvedMaxCount.maxCount).toBe(undefined);

    // Test reversed min/max dates
    const reversedDates = {
      minDate: new Date('2024-01-20'),
      maxDate: new Date('2024-01-10'),
    };
    const resolvedDates = resolveProps(reversedDates);
    expect(resolvedDates.minDate).toEqual(new Date('2024-01-10'));
    expect(resolvedDates.maxDate).toEqual(new Date('2024-01-20'));
  });

  test('handles callback exceptions gracefully', () => {
    const { createThrowingCallback } = require('./test-utils.js');

    // Test throwing callback
    const throwingCallback = createThrowingCallback(
      true,
      'Test callback error',
    );

    // Mock console.error to capture error logs
    const originalError = console.error;
    const errorLogs = [];
    console.error = (...args) => errorLogs.push(args);

    try {
      // This should not throw, but should log the error
      expect(() => {
        try {
          throwingCallback('test', 'args');
        } catch (error) {
          console.error('Error in callback:', error);
        }
      }).not.toThrow();

      expect(throwingCallback.callCount()).toBe(1);
      expect(errorLogs.length).toBe(1);
      expect(errorLogs[0][0]).toBe('Error in callback:');
    } finally {
      console.error = originalError;
    }
  });

  test('handles safe date conversion edge cases', () => {
    const { safeToMoment, safeToMomentArray } = require('./test-utils.js');

    // Test safe moment conversion
    expect(safeToMoment(null)).toBe(null);
    expect(safeToMoment(undefined)).toBe(null);
    expect(safeToMoment('invalid-date')).toBe(null);
    expect(safeToMoment(new Date('2024-01-15'))).toBeTruthy();

    // Test safe array conversion
    expect(safeToMomentArray(null)).toEqual([]);
    expect(safeToMomentArray(undefined)).toEqual([]);
    expect(safeToMomentArray('not-array')).toEqual([]);

    const mixedArray = [
      new Date('2024-01-15'),
      'invalid-date',
      null,
      new Date('2024-01-20'),
    ];
    const converted = safeToMomentArray(mixedArray);
    expect(converted.length).toBe(2); // Only valid dates should remain
  });
});
