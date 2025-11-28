import { expect, test, describe } from 'vitest';
import {
  isSameDay,
  isDateInRange,
  formatDate,
  formatMultipleDates,
  getDatesInRange,
  isDateDisabled,
  normalizeDate,
  areDateArraysEqual,
  getMonthYear,
  createDateFromMonthYear,
  addMonths,
  subtractMonths,
  isToday,
  countDaysBetween,
  isValidDate,
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
