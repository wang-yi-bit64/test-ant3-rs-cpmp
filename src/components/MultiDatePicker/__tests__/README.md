# MultiDatePicker Testing Infrastructure

This directory contains the testing infrastructure for the MultiDatePicker component, including property-based tests, unit tests, custom generators, and test utilities.

## Test Files

### `MultiDatePicker.test.js`
Unit tests for utility functions and specific examples. These tests verify:
- Date comparison functions
- Date formatting functions
- Date range generation
- Date validation
- Array comparison utilities
- Month/year manipulation

### `MultiDatePicker.properties.test.js`
Property-based tests using fast-check. These tests verify universal properties that should hold across all valid inputs:
- Date generator correctness
- Range generator correctness
- Format string application
- Utility function properties

Each property test runs 100 iterations with randomly generated inputs.

### `generators.js`
Custom fast-check generators for date picker testing:
- `arbitraryDate()` - Generate valid dates within a range
- `dateInRange(min, max)` - Generate dates within specific bounds
- `multipleDates()` - Generate arrays of unique dates
- `dateRange()` - Generate valid date ranges (start <= end)
- `formatString()` - Generate common date format strings
- `localeString()` - Generate locale identifiers
- `sizeVariant()` - Generate size options
- `positiveCount()` - Generate positive integers
- `monthNumber()` - Generate month numbers (0-11)
- `yearNumber()` - Generate year numbers
- `dateBefore(date)` - Generate dates before a reference
- `dateAfter(date)` - Generate dates after a reference
- `className()` - Generate valid CSS class names
- `placeholderString()` - Generate placeholder text

### `test-utils.js`
Utility functions for testing:
- Date comparison: `isSameDay()`, `isDateInRange()`
- Date formatting: `formatDate()`, `formatMultipleDates()`
- Date generation: `getDatesInRange()`, `normalizeDate()`
- Date validation: `isDateDisabled()`, `isValidDate()`
- Array comparison: `areDateArraysEqual()`
- Month/year utilities: `getMonthYear()`, `addMonths()`, `subtractMonths()`
- Test helpers: `createMockCallback()`, `wait()`

## Running Tests

```bash
# Run all tests once
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with UI
pnpm run test:ui
```

## Test Configuration

Tests are configured using Vitest with the following setup:
- **Test Framework**: Vitest 4.x
- **Property Testing**: fast-check 4.x
- **Environment**: jsdom (for DOM testing)
- **Setup File**: `src/__tests__/setup.js`

## Writing New Tests

### Unit Tests
```javascript
import { expect, test } from 'vitest';
import { isSameDay } from './test-utils.js';

test('isSameDay returns true for same day', () => {
  const date1 = new Date('2024-01-15T10:00:00');
  const date2 = new Date('2024-01-15T18:00:00');
  expect(isSameDay(date1, date2)).toBe(true);
});
```

### Property-Based Tests
```javascript
import { expect, test } from 'vitest';
import * as fc from 'fast-check';
import { arbitraryDate } from './generators.js';
import { isSameDay } from './test-utils.js';

test('property: dates are equal to themselves', () => {
  // **Feature: multi-date-picker, Property X: Description**
  fc.assert(
    fc.property(arbitraryDate(), (date) => {
      expect(isSameDay(date, date)).toBe(true);
      return true;
    }),
    { numRuns: 100 }
  );
});
```

## Property Test Tagging

Each property-based test MUST include a comment tag in this format:
```javascript
// **Feature: multi-date-picker, Property {number}: {property_text}**
```

This links the test to the correctness property in the design document.

## Test Coverage

The testing infrastructure supports:
- ✅ Unit testing with specific examples
- ✅ Property-based testing with random inputs
- ✅ Custom generators for domain-specific data
- ✅ Utility functions for common test operations
- ✅ Mock callback tracking
- ✅ Date manipulation and comparison

## Dependencies

- `vitest` - Test framework
- `fast-check` - Property-based testing library
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - DOM matchers
- `jsdom` - DOM environment for tests
- `moment` - Date manipulation (already in project)
