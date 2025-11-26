import { TextEncoder, TextDecoder } from 'util';
import { rstest } from '@rstest/core';
import '@testing-library/jest-dom';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
if (!global.expect && rstest.expect) {
  global.expect = rstest.expect;
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: rstest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: rstest.fn(),
    removeListener: rstest.fn(),
    addEventListener: rstest.fn(),
    removeEventListener: rstest.fn(),
    dispatchEvent: rstest.fn(),
  })),
});

global.ResizeObserver = rstest.fn().mockImplementation(() => ({
  observe: rstest.fn(),
  unobserve: rstest.fn(),
  disconnect: rstest.fn(),
}));
