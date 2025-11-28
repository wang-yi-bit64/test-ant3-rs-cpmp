import { expect, test, describe } from 'vitest';
import * as fc from 'fast-check';
import React from 'react';
import { render } from '@testing-library/react';
import MultiDatePicker from '../index.jsx';
import {
  arbitraryDate,
  dateRange,
  multipleDates,
  formatString,
  localeString,
} from './generators.js';
import {
  isSameDay,
  isDateInRange,
  formatDate,
  getDatesInRange,
  areDateArraysEqual,
  countDaysBetween,
} from './test-utils.js';

/**
 * Property-based tests for MultiDatePicker component
 * 
 * Each test runs 100 iterations with randomly generated inputs
 * to verify correctness properties hold across all valid inputs.
 */

// Example property test structure (will be populated with actual tests in later tasks)
test('example property test setup', () => {
  // **Feature: multi-date-picker, Property 0: Test infrastructure setup**
  fc.assert(
    fc.property(arbitraryDate(), (date) => {
      // Verify that generated dates are valid
      expect(date).toBeInstanceOf(Date);
      expect(Number.isNaN(date.getTime())).toBe(false);
      return true;
    }),
    { numRuns: 100 },
  );
});

test('date range generator produces valid ranges', () => {
  // **Feature: multi-date-picker, Property 0: Test infrastructure setup**
  fc.assert(
    fc.property(dateRange(), ([start, end]) => {
      // Verify that start is always before or equal to end
      expect(start.getTime()).toBeLessThanOrEqual(end.getTime());
      return true;
    }),
    { numRuns: 100 },
  );
});

test('multiple dates generator produces unique dates', () => {
  // **Feature: multi-date-picker, Property 0: Test infrastructure setup**
  fc.assert(
    fc.property(multipleDates({ maxLength: 5 }), (dates) => {
      // Verify that all dates are unique by day
      const dayStrings = dates.map((d) => d.toISOString().split('T')[0]);
      const uniqueDays = new Set(dayStrings);
      expect(uniqueDays.size).toBe(dates.length);
      return true;
    }),
    { numRuns: 100 },
  );
});

test('format string generator produces valid formats', () => {
  // **Feature: multi-date-picker, Property 0: Test infrastructure setup**
  fc.assert(
    fc.property(formatString(), arbitraryDate(), (format, date) => {
      // Verify that format strings can be used to format dates
      const formatted = formatDate(date, format);
      expect(typeof formatted).toBe('string');
      expect(formatted.length).toBeGreaterThan(0);
      return true;
    }),
    { numRuns: 100 },
  );
});

test('locale generator produces valid locales', () => {
  // **Feature: multi-date-picker, Property 0: Test infrastructure setup**
  fc.assert(
    fc.property(localeString(), (locale) => {
      // Verify that locale strings are valid
      expect(['zh-CN', 'en-US']).toContain(locale);
      return true;
    }),
    { numRuns: 100 },
  );
});

// Utility function tests
test('isSameDay correctly identifies same days', () => {
  fc.assert(
    fc.property(arbitraryDate(), (date) => {
      const date1 = new Date(date);
      const date2 = new Date(date);
      date2.setHours(23, 59, 59, 999); // Different time, same day
      expect(isSameDay(date1, date2)).toBe(true);
      return true;
    }),
    { numRuns: 100 },
  );
});

test('getDatesInRange generates correct number of dates', () => {
  fc.assert(
    fc.property(
      // Use a smaller date range to avoid timeout with very large ranges
      fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
      fc.integer({ min: 1, max: 365 }), // Max 1 year range
      (start, daysToAdd) => {
        const end = new Date(start.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
        const dates = getDatesInRange(start, end);
        // Use moment to calculate days to handle DST correctly
        const daysDiff = countDaysBetween(start, end);
        expect(dates.length).toBe(daysDiff);
        return true;
      },
    ),
    { numRuns: 100 },
  );
});

test('areDateArraysEqual correctly compares date arrays', () => {
  fc.assert(
    fc.property(multipleDates({ maxLength: 5 }), (dates) => {
      const shuffled = [...dates].sort(() => Math.random() - 0.5);
      expect(areDateArraysEqual(dates, shuffled)).toBe(true);
      return true;
    }),
    { numRuns: 100 },
  );
});

// **Feature: multi-date-picker, Property 3: Controlled value synchronization**
test('controlled value synchronization - DatePicker displays prop value in input field', () => {
  fc.assert(
    fc.property(multipleDates({ minLength: 1, maxLength: 5 }), (dates) => {
      // For any date value passed as a prop, the DatePicker should display that date in the input field
      // This tests that when we pass a value prop, the component displays it correctly
      
      // Create a controlled component with the generated dates
      const { container } = render(
        <MultiDatePicker value={dates} onChange={() => {}} />
      );
      
      // Get the input element
      const input = container.querySelector('.mdp-input');
      expect(input).toBeTruthy();
      
      // Get the displayed text
      const displayedText = container.querySelector('.mdp-text-value');
      
      if (dates.length > 0) {
        expect(displayedText).toBeTruthy();
        
        // Verify that all dates are displayed in the input
        const displayedContent = displayedText.textContent;
        
        // Each date should appear in the display
        dates.forEach((date) => {
          const formattedDate = formatDate(date, 'YYYY-MM-DD');
          expect(displayedContent).toContain(formattedDate);
        });
        
        // Verify the count badge shows the correct number
        const badge = container.querySelector('.mdp-badge-count');
        expect(badge).toBeTruthy();
        expect(badge.textContent).toBe(String(dates.length));
      }
      
      return true;
    }),
    { numRuns: 100 },
  );
});
