import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { defineConfig, devices } from '@playwright/test'

function loadEnvFile(filename: string): void {
  const filePath = resolve(process.cwd(), filename)
  if (!existsSync(filePath)) return

  for (const line of readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const raw = trimmed.slice(eq + 1).trim()
    const value = raw.replace(/^["']|["']$/g, '')
    if (!(key in process.env)) process.env[key] = value
  }
}

loadEnvFile('.env')
loadEnvFile('.env.local')

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'
const e2eEnabled = process.env.E2E_ENABLED === 'true'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  timeout: 90_000,
  expect: { timeout: 20_000 },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: e2eEnabled
    ? {
        command: 'pnpm run dev',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
})