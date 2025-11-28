import * as fc from 'fast-check';
import moment from 'moment';

/**
 * Custom fast-check generators for date picker property-based testing
 */

/**
 * Generate a valid JavaScript Date within a reasonable range
 * Default range: 1970-01-01 to 2100-12-31
 */
export const arbitraryDate = (options = {}) => {
  const {
    min = new Date('1970-01-01'),
    max = new Date('2100-12-31'),
  } = options;

  return fc
    .integer({ min: min.getTime(), max: max.getTime() })
    .map((timestamp) => new Date(timestamp));
};

/**
 * Generate a date within a specific range
 */
export const dateInRange = (min, max) => {
  return arbitraryDate({ min, max });
};

/**
 * Generate an array of non-consecutive dates
 * Useful for testing multiple selection mode
 */
export const multipleDates = (options = {}) => {
  const { minLength = 1, maxLength = 10, ...dateOptions } = options;

  return fc
    .array(arbitraryDate(dateOptions), { minLength, maxLength })
    .map((dates) => {
      // Sort and deduplicate dates by day
      const uniqueDates = [];
      const seen = new Set();

      dates
        .sort((a, b) => a.getTime() - b.getTime())
        .forEach((date) => {
          const dayKey = moment(date).format('YYYY-MM-DD');
          if (!seen.has(dayKey)) {
            seen.add(dayKey);
            uniqueDates.push(date);
          }
        });

      return uniqueDates;
    });
};

/**
 * Generate a date range (start, end) where start <= end
 * Returns [startDate, endDate]
 */
export const dateRange = (options = {}) => {
  return fc
    .tuple(arbitraryDate(options), arbitraryDate(options))
    .map(([d1, d2]) => {
      return d1.getTime() <= d2.getTime() ? [d1, d2] : [d2, d1];
    });
};

/**
 * Generate a format string for date display
 * Common formats: YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY, YYYY/MM/DD
 */
export const formatString = () => {
  return fc.constantFrom(
    'YYYY-MM-DD',
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'YYYY/MM/DD',
    'YYYY.MM.DD',
    'DD.MM.YYYY',
  );
};

/**
 * Generate a locale string
 */
export const localeString = () => {
  return fc.constantFrom('zh-CN', 'en-US');
};

/**
 * Generate a size variant
 */
export const sizeVariant = () => {
  return fc.constantFrom('small', 'default', 'large');
};

/**
 * Generate a positive integer for counts (e.g., maxCount, numberOfMonths)
 */
export const positiveCount = (options = {}) => {
  const { min = 1, max = 12 } = options;
  return fc.integer({ min, max });
};

/**
 * Generate a month number (0-11)
 */
export const monthNumber = () => {
  return fc.integer({ min: 0, max: 11 });
};

/**
 * Generate a year number within reasonable range
 */
export const yearNumber = (options = {}) => {
  const { min = 1970, max = 2100 } = options;
  return fc.integer({ min, max });
};

/**
 * Generate a date that is definitely before another date
 */
export const dateBefore = (referenceDate) => {
  const refTime = referenceDate.getTime();
  const minTime = new Date('1970-01-01').getTime();
  return fc
    .integer({ min: minTime, max: refTime - 86400000 }) // At least 1 day before
    .map((timestamp) => new Date(timestamp));
};

/**
 * Generate a date that is definitely after another date
 */
export const dateAfter = (referenceDate) => {
  const refTime = referenceDate.getTime();
  const maxTime = new Date('2100-12-31').getTime();
  return fc
    .integer({ min: refTime + 86400000, max: maxTime }) // At least 1 day after
    .map((timestamp) => new Date(timestamp));
};

/**
 * Generate a valid CSS class name
 */
export const className = () => {
  return fc.stringMatching(/^[a-z][a-z0-9-]*$/);
};

/**
 * Generate a placeholder string
 */
export const placeholderString = () => {
  return fc.constantFrom(
    'Select date',
    'Choose a date',
    'Pick a date',
    'Select dates',
    '请选择日期',
    '选择日期',
  );
};
