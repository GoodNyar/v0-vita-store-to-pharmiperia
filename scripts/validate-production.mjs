#!/usr/bin/env node
/**
 * Phase 1 production validation — static gates + optional typecheck/build.
 * Ops prerequisites (DNS, live Stripe, uptime SaaS) are warnings, not script failures.
 *
 * Usage:
 *   pnpm validate:production
 *   VALIDATE_RUN_BUILD=false pnpm validate:production   # skip next build
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = process.cwd()
const runBuild = process.env.VALIDATE_RUN_BUILD !== 'false'
const runTypecheck = process.env.VALIDATE_RUN_TYPECHECK !== 'false'

const results = { pass: [], fail: [], warn: [] }

function pass(id, message) {
  results.pass.push({ id, message })
}

function fail(id, message) {
  results.fail.push({ id, message })
}

function warn(id, message) {
  results.warn.push({ id, message })
}

function exists(relPath) {
  return existsSync(join(root, relPath))
}

function read(relPath) {
  return readFileSync(join(root, relPath), 'utf8')
}

function mustExist(id, relPath, label = relPath) {
  if (exists(relPath)) pass(id, `${label} present`)
  else fail(id, `Missing ${label}`)
}

function mustNotContain(id, relPath, needle, label) {
  if (!exists(relPath)) {
    fail(id, `Cannot check ${label}: file missing`)
    return
  }
  const content = read(relPath)
  if (content.includes(needle)) fail(id, `${label} must not contain "${needle}"`)
  else pass(id, `${label} OK`)
}

function grepSource(pattern) {
  const hits = []
  const re = new RegExp(pattern)
  const roots = ['app', 'components', 'lib', 'e2e', 'middleware.ts', 'next.config.mjs', 'playwright.config.ts']

  function walk(relPath) {
    const abs = join(root, relPath)
    if (!existsSync(abs)) return

    const stat = statSync(abs)
    if (stat.isFile()) {
      if (/\.(ts|tsx|mjs)$/.test(relPath) && re.test(read(relPath))) hits.push(relPath)
      return
    }

    for (const entry of readdirSync(abs, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue
      walk(join(relPath, entry.name))
    }
  }

  for (const item of roots) walk(item)
  return hits
}

function runCommand(id, command, args, label) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pharm.lv',
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? 'sk_test_validate_placeholder',
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? 'whsec_validate_placeholder',
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? 'pk_test_validate_placeholder',
      NEXT_PUBLIC_SUPABASE_URL:
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.validate_placeholder',
      SUPABASE_SERVICE_ROLE_KEY:
        process.env.SUPABASE_SERVICE_ROLE_KEY ??
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.validate_service_role',
    },
  })

  if (result.status === 0) pass(id, label)
  else {
    const stderr = (result.stderr || result.stdout || '').trim().split('\n').slice(-8).join('\n')
    fail(id, `${label} failed (exit ${result.status})${stderr ? `\n${stderr}` : ''}`)
  }
}

console.log('Pharmiperia — Phase 1 Production Validation\n')

// ── Infrastructure ───────────────────────────────────────────────────────────
mustExist('ci-workflow', '.github/workflows/ci.yml', 'CI workflow')
mustExist('env-example', '.env.example', '.env.example')
mustNotContain('no-ignore-build-errors', 'next.config.mjs', 'ignoreBuildErrors', 'next.config.mjs')

// ── Phase 1 deliverables (files) ─────────────────────────────────────────────
const requiredPaths = [
  ['stripe-webhook', 'app/api/webhooks/stripe/route.ts'],
  ['health-endpoint', 'app/api/health/route.ts'],
  ['orders-module', 'lib/orders.ts'],
  ['money-module', 'lib/money.ts'],
  ['site-env-config', 'lib/site.ts'],
  ['rate-limit', 'lib/rate-limit/index.ts'],
  ['captcha', 'lib/captcha/turnstile.ts'],
  ['sentry-checkout', 'lib/sentry/capture-checkout.ts'],
  ['monitoring-health', 'lib/monitoring/health.ts'],
  ['ai-flags', 'lib/features/ai.ts'],
  ['cookie-consent', 'components/cookie-consent-banner.tsx'],
  ['playwright-config', 'playwright.config.ts'],
  ['e2e-checkout', 'e2e/checkout.spec.ts'],
  ['locale-error-boundary', 'app/[locale]/error.tsx'],
  ['checkout-error-boundary', 'app/[locale]/checkout/error.tsx'],
  ['supabase-baseline', 'supabase/migrations/20260703120000_baseline.sql'],
  ['supabase-seed', 'supabase/seed.sql'],
]

for (const [id, path] of requiredPaths) mustExist(id, path)

const adrDir = join(root, 'docs/adr')
if (existsSync(adrDir)) {
  const adrCount = readdirSync(adrDir).filter((f) => /^\d{4}-.+\.md$/.test(f)).length
  if (adrCount >= 15) pass('adr-index', `${adrCount} ADR documents (≥15)`)
  else fail('adr-index', `Expected ≥15 ADRs, found ${adrCount}`)
} else {
  fail('adr-index', 'docs/adr missing')
}

// ── Domain policy: no legacy hardcoded host in source ──────────────────────────
const legacyHostHits = grepSource('pharmiperia\\.lv')
if (legacyHostHits.length === 0) pass('no-legacy-domain-hardcode', 'No pharmiperia.lv in app/lib source')
else {
  fail(
    'no-legacy-domain-hardcode',
    `pharmiperia.lv found in: ${legacyHostHits.map((h) => relative(root, h)).join(', ')}`
  )
}

if (read('lib/site.ts').includes('NEXT_PUBLIC_SITE_URL')) {
  pass('site-url-env-driven', 'lib/site.ts reads NEXT_PUBLIC_SITE_URL')
} else {
  fail('site-url-env-driven', 'lib/site.ts must use NEXT_PUBLIC_SITE_URL')
}

// ── AI off by default ──────────────────────────────────────────────────────────
const aiSource = read('lib/features/ai.ts')
if (aiSource.includes("=== 'true'")) pass('ai-opt-in-flags', 'AI features require explicit NEXT_PUBLIC_*=true')
else fail('ai-opt-in-flags', 'AI feature flags must be opt-in (=== true)')

// ── Env.example coverage ───────────────────────────────────────────────────────
const envExample = read('.env.example')
const requiredEnvDocs = [
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'SENTRY_DSN',
  'E2E_ENABLED',
  'MONITORING_HEALTH_TOKEN',
]
for (const key of requiredEnvDocs) {
  if (envExample.includes(key)) pass(`env-doc-${key}`, `.env.example documents ${key}`)
  else fail(`env-doc-${key}`, `.env.example missing ${key}`)
}

// ── Known Phase 1 gaps (warnings) ──────────────────────────────────────────────
if (read('next.config.mjs').includes('unoptimized: true')) {
  warn('image-unoptimized', 'next.config.mjs has images.unoptimized: true — fix in Phase 2 per Playbook §8')
}

if (!exists('app/global-error.tsx')) {
  warn('global-error-missing', 'No app/global-error.tsx — add in Phase 2 reliability pass')
}

warn('eslint-debt', 'ESLint may still report errors — run pnpm lint; not a Phase 1 script blocker')
warn('ops-domain-dns', 'Verify pharm.lv DNS, MX, SPF/DKIM/DMARC before accepting payments')
warn('ops-stripe-live', 'Switch Stripe to live mode + register webhook URL on production deploy')
warn('ops-uptime-monitor', 'Configure external poll of GET /api/health (ADR-0014)')
warn('ops-e2e-staging', 'Run E2E_ENABLED=true smoke on staging with real Supabase/Stripe test keys')
warn('ops-sentry-dsn', 'Set SENTRY_DSN / NEXT_PUBLIC_SENTRY_DSN in production environment')

// ── Dynamic checks ─────────────────────────────────────────────────────────────
if (runTypecheck) {
  runCommand('typecheck', join(root, 'node_modules/.bin/tsc'), ['--noEmit'], 'TypeScript (tsc --noEmit)')
}

if (runBuild) {
  runCommand('production-build', join(root, 'node_modules/.bin/next'), ['build'], 'Next.js production build')
}

// ── Report ───────────────────────────────────────────────────────────────────
console.log(`✅ Passed: ${results.pass.length}`)
for (const item of results.pass) console.log(`   • ${item.id}: ${item.message}`)

if (results.warn.length) {
  console.log(`\n⚠️  Warnings: ${results.warn.length}`)
  for (const item of results.warn) console.log(`   • ${item.id}: ${item.message}`)
}

if (results.fail.length) {
  console.log(`\n❌ Failed: ${results.fail.length}`)
  for (const item of results.fail) console.log(`   • ${item.id}: ${item.message}`)
}

const engineeringReady = results.fail.length === 0
const verdict = engineeringReady
  ? 'CONDITIONAL GO — Phase 1 engineering gates pass; complete ops warnings before launch'
  : 'NO-GO — fix failed checks before deploy'

console.log(`\nVerdict: ${verdict}\n`)

process.exit(engineeringReady ? 0 : 1)