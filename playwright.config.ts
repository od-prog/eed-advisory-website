import { defineConfig, devices } from "@playwright/test";

const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  retries: isCI ? 2 : 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  outputDir: "test-results",
  webServer: {
    command: "pnpm --filter web exec astro dev --host 127.0.0.1 --port 4322",
    url: "http://127.0.0.1:4322/e2e-fixtures/motion",
    reuseExistingServer: !isCI,
    timeout: 120_000,
    env: {
      WEBSITE_URL: "http://127.0.0.1:4322",
      CMS_URL: "http://127.0.0.1:3000",
      CMS_API_KEY: "",
      PREVIEW_SECRET: "motion-e2e-placeholder",
      VERCEL_ENV: "development",
    },
  },
  use: {
    baseURL: "http://127.0.0.1:4322",
    ...devices["Desktop Chrome"],
  },
});
