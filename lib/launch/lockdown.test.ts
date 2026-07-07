import assert from 'node:assert/strict'
import { describe, it, beforeEach, afterEach } from 'node:test'
import {
  hashLaunchBypassSecret,
  isLaunchBypassQueryToken,
  isMaintenanceMode,
  isValidLaunchBypassCookie,
} from './lockdown'

describe('launch lockdown', () => {
  const env = { ...process.env }

  beforeEach(() => {
    delete process.env.MAINTENANCE_MODE
    delete process.env.SITE_MAINTENANCE_MODE
    delete process.env.LAUNCH_BYPASS_SECRET
  })

  afterEach(() => {
    process.env = { ...env }
  })

  it('detects maintenance mode from MAINTENANCE_MODE', () => {
    process.env.MAINTENANCE_MODE = 'true'
    assert.equal(isMaintenanceMode(), true)
    process.env.MAINTENANCE_MODE = 'false'
    assert.equal(isMaintenanceMode(), false)
  })

  it('falls back to SITE_MAINTENANCE_MODE', () => {
    process.env.SITE_MAINTENANCE_MODE = '1'
    assert.equal(isMaintenanceMode(), true)
  })

  it('defaults to lockdown in production until Go-Live', () => {
    const env = process.env as Record<string, string | undefined>
    const prevNodeEnv = env.NODE_ENV
    env.NODE_ENV = 'production'
    delete env.VERCEL_ENV
    try {
      assert.equal(isMaintenanceMode(), true)
      env.MAINTENANCE_MODE = 'false'
      assert.equal(isMaintenanceMode(), false)
    } finally {
      env.NODE_ENV = prevNodeEnv
    }
  })

  it('keeps Vercel preview open unless explicitly locked', () => {
    const env = process.env as Record<string, string | undefined>
    const prevNodeEnv = env.NODE_ENV
    const prevVercelEnv = env.VERCEL_ENV
    env.NODE_ENV = 'production'
    env.VERCEL_ENV = 'preview'
    try {
      assert.equal(isMaintenanceMode(), false)
      env.MAINTENANCE_MODE = 'true'
      assert.equal(isMaintenanceMode(), true)
    } finally {
      env.NODE_ENV = prevNodeEnv
      env.VERCEL_ENV = prevVercelEnv
    }
  })

  it('stays open in local development by default', () => {
    const env = process.env as Record<string, string | undefined>
    const prevNodeEnv = env.NODE_ENV
    env.NODE_ENV = 'development'
    try {
      assert.equal(isMaintenanceMode(), false)
    } finally {
      env.NODE_ENV = prevNodeEnv
    }
  })

  it('validates bypass secret and cookie hash', async () => {
    process.env.LAUNCH_BYPASS_SECRET = 'test-secret'
    assert.equal(isLaunchBypassQueryToken('test-secret'), true)
    assert.equal(isLaunchBypassQueryToken('wrong'), false)

    const hash = await hashLaunchBypassSecret('test-secret')
    assert.equal(await isValidLaunchBypassCookie(hash), true)
    assert.equal(await isValidLaunchBypassCookie('invalid'), false)
  })
})