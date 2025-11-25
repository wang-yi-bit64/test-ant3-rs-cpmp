import { defineConfig } from "@rstest/core";
import { pluginReact } from "@rsbuild/plugin-react";
export default defineConfig({
  plugins: [pluginReact()],
  testEnvironment: "node",
  coverage: {
    enabled: true,
  },
});
