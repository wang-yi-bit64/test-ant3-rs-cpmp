import { defineConfig } from "@rstest/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginBabel } from "@rsbuild/plugin-babel";

export default defineConfig({
  globals: true,
  testEnvironment: "jsdom",
  plugins: [pluginReact(), pluginBabel()],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  projects: [
    {
      name: "react",
      include: [
        "src/**/*.test.{js,jsx}",
        "src/**/__tests__/*.{js,jsx}",
      ],
      testEnvironment: "jsdom",
    },
  ],
  coverage: {
    enabled: false,
  },
  tools: {
    swc: {
      jsc: {
        parser: { syntax: "ecmascript", jsx: true },
        transform: {
          react: {
            runtime: "automatic",
            development: true,
          },
        },
        target: "es2018",
      },
    },
  },
});
