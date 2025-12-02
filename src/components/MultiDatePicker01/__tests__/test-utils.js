import moment from 'moment';

/**
 * Test utility functions for MultiDatePicker component testing
 */

/**
 * Check if two dates represent the same day (ignoring time)
 */
export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  return moment(date1).isSame(moment(date2), 'day');
};

/**
 * Check if a date is within a range (inclusive)
 */
export const isDateInRange = (date, start, end) => {
  if (!date || !start || !end) return false;
  const m = moment(date);
  return m.isSameOrAfter(start, 'day') && m.isSameOrBefore(end, 'day');
};

/**
 * Format a date using moment
 */
export const formatDate = (date, format = 'YYYY/MM/DD') => {
  if (!date) return '';
  return moment(date).format(format);
};

/**
 * Format multiple dates with a separator
 */
export const formatMultipleDates = (
  dates,
  format = 'YYYY/MM/DD',
  separator = ', ',
) => {
  if (!dates || dates.length === 0) return '';
  return dates.map((d) => formatDate(d, format)).join(separator);
};

/**
 * Generate all dates between start and end (inclusive)
 */
export const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  const current = moment(startDate);
  const end = moment(endDate);

  while (current.isSameOrBefore(end, 'day')) {
    dates.push(current.clone().toDate());
    current.add(1, 'day');
  }

  return dates;
};

/**
 * Check if a date is disabled based on min/max constraints
 */
export const isDateDisabled = (date, minDate, maxDate) => {
  if (!date) return true;
  const m = moment(date);

  if (minDate && m.isBefore(moment(minDate), 'day')) {
    return true;
  }

  if (maxDate && m.isAfter(moment(maxDate), 'day')) {
    return true;
  }

  return false;
};

/**
 * Normalize a date to start of day (removes time component)
 */
export const normalizeDate = (date) => {
  if (!date) return null;
  return moment(date).startOf('day').toDate();
};

/**
 * Check if two date arrays contain the same dates (order independent)
 */
export const areDateArraysEqual = (dates1, dates2) => {
  if (!dates1 || !dates2) return dates1 === dates2;
  if (dates1.length !== dates2.length) return false;

  const normalized1 = dates1.map((d) => moment(d).format('YYYY-MM-DD')).sort();
  const normalized2 = dates2.map((d) => moment(d).format('YYYY-MM-DD')).sort();

  return normalized1.every((d, i) => d === normalized2[i]);
};

/**
 * Get the month and year from a date
 */
export const getMonthYear = (date) => {
  const m = moment(date);
  return {
    month: m.month(), // 0-11
    year: m.year(),
  };
};

/**
 * Create a date from month and year
 */
export const createDateFromMonthYear = (month, year) => {
  return moment().year(year).month(month).startOf('month').toDate();
};

/**
 * Add months to a date
 */
export const addMonths = (date, count) => {
  return moment(date).add(count, 'months').toDate();
};

/**
 * Subtract months from a date
 */
export const subtractMonths = (date, count) => {
  return moment(date).subtract(count, 'months').toDate();
};

/**
 * Check if a date is today
 */
export const isToday = (date) => {
  return moment(date).isSame(moment(), 'day');
};

/**
 * Get the start of month for a date
 */
export const getStartOfMonth = (date) => {
  return moment(date).startOf('month').toDate();
};

/**
 * Get the end of month for a date
 */
export const getEndOfMonth = (date) => {
  return moment(date).endOf('month').toDate();
};

/**
 * Count the number of days between two dates (inclusive)
 */
export const countDaysBetween = (startDate, endDate) => {
  const start = moment(startDate).startOf('day');
  const end = moment(endDate).startOf('day');
  return end.diff(start, 'days') + 1;
};

/**
 * Create a mock callback function that tracks calls
 */
export const createMockCallback = () => {
  const calls = [];
  const fn = (...args) => {
    calls.push(args);
  };
  fn.calls = calls;
  fn.callCount = () => calls.length;
  fn.lastCall = () => calls[calls.length - 1];
  fn.reset = () => {
    calls.length = 0;
  };
  return fn;
};

/**
 * Wait for a specified number of milliseconds
 */
export const wait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Check if a value is a valid date
 */
export const isValidDate = (date) => {
  return date instanceof Date && !Number.isNaN(date.getTime());
};

/**
 * Convert various date formats to Date object
 */
export const toDate = (value) => {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return isValidDate(date) ? date : null;
  }
  if (moment.isMoment(value)) return value.toDate();
  return null;
};

/**
 * Safely convert value to moment object with error handling
 */
export const safeToMoment = (dateValue) => {
  try {
    if (!dateValue) return null;
    const m = moment(dateValue);
    return m.isValid() ? m : null;
  } catch (error) {
    console.warn('Invalid date value provided:', dateValue, error);
    return null;
  }
};

/**
 * Safely convert array of dates to moment objects
 */
export const safeToMomentArray = (dateArray) => {
  if (!Array.isArray(dateArray)) return [];
  return dateArray.map(safeToMoment).filter(Boolean); // Remove null values
};

/**
 * Create a mock callback that can throw errors for testing
 */
export const createThrowingCallback = (
  shouldThrow = true,
  errorMessage = 'Test error',
) => {
  const calls = [];
  const fn = (...args) => {
    calls.push(args);
    if (shouldThrow) {
      throw new Error(errorMessage);
    }
  };
  fn.calls = calls;
  fn.callCount = () => calls.length;
  fn.lastCall = () => calls[calls.length - 1];
  fn.reset = () => {
    calls.length = 0;
  };
  return fn;
};

/**
 * Validate prop conflicts and return resolved props
 */
export const resolveProps = (props) => {
  const { multiple, range, numberOfMonths, maxCount, minDate, maxDate } = props;

  let resolvedMultiple = multiple;
  const resolvedRange = range;

  // Range takes precedence over multiple
  if (range && multiple) {
    resolvedMultiple = false;
  }

  // Validate numberOfMonths
  let resolvedNumberOfMonths = numberOfMonths;
  if (numberOfMonths && (numberOfMonths < 1 || numberOfMonths > 12)) {
    resolvedNumberOfMonths = 1;
  }

  // Validate maxCount
  let resolvedMaxCount = maxCount;
  if (maxCount && (!resolvedMultiple || maxCount < 1)) {
    resolvedMaxCount = undefined;
  }

  // Validate min/max dates
  let resolvedMinDate = minDate;
  let resolvedMaxDate = maxDate;

  if (minDate && maxDate) {
    const min = moment(minDate);
    const max = moment(maxDate);

    if (min.isValid() && max.isValid() && min.isAfter(max, 'day')) {
      resolvedMinDate = maxDate;
      resolvedMaxDate = minDate;
    }
  }

  return {
    multiple: resolvedMultiple,
    range: resolvedRange,
    numberOfMonths: resolvedNumberOfMonths,
    maxCount: resolvedMaxCount,
    minDate: resolvedMinDate,
    maxDate: resolvedMaxDate,
  };
};
