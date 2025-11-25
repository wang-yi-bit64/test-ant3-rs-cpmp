const { TextEncoder, TextDecoder } = require('util');
const { rstest } = require('@rstest/core');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

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
