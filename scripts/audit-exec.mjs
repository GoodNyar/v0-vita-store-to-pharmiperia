#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const env = {
  ...process.env,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pharm.lv',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? 'sk_test_ci_placeholder',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? 'whsec_ci_placeholder',
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? 'pk_test_ci_placeholder',
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ci_placeholder',
  SUPABASE_SERVICE_ROLE_KEY:
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ci_service_role_placeholder',
  VALIDATE_RUN_BUILD: 'false',
  VALIDATE_RUN_TYPECHECK: 'false',
  PATH: `/opt/homebrew/bin:${process.env.PATH ?? ''}`,
}

const steps = [
  ['git branch --show-current', 'git', ['branch', '--show-current']],
  ['pnpm install', 'pnpm', ['install']],
  ['pnpm lint', 'pnpm', ['lint']],
  ['pnpm typecheck', 'pnpm', ['typecheck']],
  ['pnpm build', 'pnpm', ['build']],
  ['pnpm validate:production', 'pnpm', ['validate:production']],
  ['pnpm test', 'pnpm', ['test']],
]

const results = []
for (const [name, cmd, args] of steps) {
  const r = spawnSync(cmd, args, { cwd: root, env, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 })
  results.push({
    name,
    exitCode: r.status,
    stdout: r.stdout ?? '',
    stderr: r.stderr ?? '',
    error: r.error?.message ?? null,
  })
}

const statusBefore = spawnSync('git', ['status', '--porcelain'], {
  cwd: root,
  env,
  encoding: 'utf8',
})
results.push({
  name: 'git status --porcelain (before)',
  exitCode: statusBefore.status,
  stdout: statusBefore.stdout ?? '',
  stderr: statusBefore.stderr ?? '',
  error: statusBefore.error?.message ?? null,
})

const add = spawnSync('git', ['add', '.'], { cwd: root, env, encoding: 'utf8' })
results.push({
  name: 'git add .',
  exitCode: add.status,
  stdout: add.stdout ?? '',
  stderr: add.stderr ?? '',
  error: add.error?.message ?? null,
})

const hasChanges = Boolean((statusBefore.stdout ?? '').trim())
if (hasChanges) {
  const commit = spawnSync(
    'git',
    ['commit', '-m', 'feat(phase-3): complete post-audit remediation'],
    { cwd: root, env, encoding: 'utf8' }
  )
  results.push({
    name: 'git commit',
    exitCode: commit.status,
    stdout: commit.stdout ?? '',
    stderr: commit.stderr ?? '',
    error: commit.error?.message ?? null,
  })
} else {
  results.push({
    name: 'git commit',
    exitCode: 0,
    stdout: 'skipped — working tree already clean',
    stderr: '',
    error: null,
  })
}

const push = spawnSync('git', ['push', '-u', 'origin', 'HEAD'], { cwd: root, env, encoding: 'utf8' })
results.push({
  name: 'git push',
  exitCode: push.status,
  stdout: push.stdout ?? '',
  stderr: push.stderr ?? '',
  error: push.error?.message ?? null,
})

for (const [name, args] of [
  ['git status', ['status']],
  ['git log -1', ['log', '-1', '--oneline']],
]) {
  const r = spawnSync('git', args, { cwd: root, env, encoding: 'utf8' })
  results.push({
    name,
    exitCode: r.status,
    stdout: r.stdout ?? '',
    stderr: r.stderr ?? '',
    error: r.error?.message ?? null,
  })
}

const outPath = join(root, 'docs/reports/audit-pipeline-output.json')
writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2))
console.log(`Wrote ${outPath}`)
for (const r of results) {
  console.log(`${r.name}: exit ${r.exitCode}`)
}
process.exit(results.some((r) => r.exitCode !== 0) ? 1 : 0)