import { defineConfig, devices } from '@playwright/test'

const runE2E = process.env.E2E === '1'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  ...(runE2E
    ? {
        webServer: {
          command: 'pnpm --filter web dev',
          url: 'http://localhost:4321',
          reuseExistingServer: true,
          timeout: 120_000,
        },
      }
    : {}),
  use: {
    ...(runE2E ? { baseURL: 'http://localhost:4321' } : {}),
    ...devices['Desktop Chrome'],
  },
})
