import { pluginBabel } from "@rsbuild/plugin-babel";
import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rstest/core';

export default defineConfig({
  globals: true,
  testEnvironment: 'jsdom',
  plugins: [pluginReact(), pluginBabel()],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  projects: [
    {
      name: 'react',
      include: [
        'src/components/MultiDatePicker/**/*.test.{js,jsx}',
        'src/components/MultiDatePicker/**/__tests__/*.{js,jsx}',
      ],
      testEnvironment: 'jsdom',
    },
  ],
  coverage: {
    enabled: false,
  },
  tools: {},
});
