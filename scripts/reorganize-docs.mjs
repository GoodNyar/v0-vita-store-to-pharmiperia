#!/usr/bin/env node
import { existsSync, mkdirSync, renameSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'

const docs = join(process.cwd(), 'docs')

function mv(src, dst) {
  const from = join(docs, src)
  const to = join(docs, dst)
  if (!existsSync(from)) return
  if (existsSync(to)) return
  mkdirSync(dirname(to), { recursive: true })
  renameSync(from, to)
  console.log(`mv ${src} → ${dst}`)
}

const moves = [
  ['reports/phase-1-final-summary.md', 'roadmap/phase-1.md'],
  ['reports/phase-2-final-summary.md', 'roadmap/phase-2.md'],
  ['reports/phase-2-master-plan.md', 'roadmap/phase-2-master-plan.md'],
  ['reports/phase-2-prerequisites.md', 'roadmap/phase-2-prerequisites.md'],
  ['reports/phase-3-final-summary.md', 'roadmap/phase-3.md'],
  ['reports/phase-3-master-plan.md', 'roadmap/phase-3-master-plan.md'],
  ['reports/phase-4-final-summary.md', 'roadmap/phase-4.md'],
  ['reports/phase-4-prerequisites.md', 'roadmap/phase-4-prerequisites.md'],
  ['reports/phase-5-final-summary.md', 'roadmap/phase-5.md'],
  ['reports/phase-5-master-plan.md', 'roadmap/phase-5-master-plan.md'],
  ['reports/phase-6-final-summary.md', 'roadmap/phase-6.md'],
  ['reports/phase-6-master-plan.md', 'roadmap/phase-6-master-plan.md'],
  ['reports/08-biznes-plan.md', 'business/business-plan.md'],
  ['reports/09-finansovaya-model-36-mesyacev.md', 'business/financial-model.md'],
  ['reports/10-vc-due-diligence.md', 'business/VC-due-diligence.md'],
  ['reports/07-staff-level-code-review.md', 'reports/reviews/staff-level-code-review.md'],
  ['reports/04-production-readiness-audit.md', 'reports/reviews/production-readiness-audit.md'],
  ['reports/01-struktura-proekta.md', 'reports/history/01-struktura-proekta.md'],
  ['reports/02-glubokij-analiz-i-54-uluchsheniya.md', 'reports/history/02-glubokij-analiz-i-54-uluchsheniya.md'],
  ['reports/03-arhitekturnyj-audit-masshtabiruemosti.md', 'reports/history/03-arhitekturnyj-audit-masshtabiruemosti.md'],
  ['reports/06-refactoring-blueprint.md', 'reports/history/06-refactoring-blueprint.md'],
  ['reports/11-phase-1-production-validation.md', 'reports/audits/11-phase-1-production-validation.md'],
  ['reports/12-nezavisimyj-audit-post-phase-2.md', 'reports/audits/12-nezavisimyj-audit-post-phase-2.md'],
  ['reports/13-self-audit-phase-3.md', 'reports/audits/13-self-audit-phase-3.md'],
  ['reports/14-claude-audit-brief.md', 'reports/audits/14-claude-audit-brief.md'],
  ['reports/15-nezavisimyj-audit-phase-3.md', 'reports/audits/15-nezavisimyj-audit-phase-3.md'],
  ['reports/17-nezavisimyj-audit-phase-4.md', 'reports/audits/17-nezavisimyj-audit-phase-4.md'],
  ['reports/18-zero-trust-production-audit-phase-4.md', 'reports/audits/18-zero-trust-production-audit-phase-4.md'],
  ['reports/19-self-audit-phase-5.md', 'reports/audits/19-self-audit-phase-5.md'],
  ['reports/20-nezavisimyj-audit-phase-5.md', 'reports/audits/20-nezavisimyj-audit-phase-5.md'],
  ['reports/21-self-audit-phase-6.md', 'reports/audits/21-self-audit-phase-6.md'],
  ['reports/22-nezavisimyj-audit-phase-6.md', 'reports/audits/22-nezavisimyj-audit-phase-6.md'],
  ['reports/23-final-release-candidate-audit.md', 'reports/audits/23-final-release-candidate-audit.md'],
  ['reports/16-self-audit-phase-4.md', 'archive/16-self-audit-phase-4.md'],
  ['reports/phase-2-progress.md', 'archive/phase-2-progress.md'],
]

for (const [src, dst] of moves) mv(src, dst)

function walk(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p, acc)
    else if (e.endsWith('.md')) acc.push(p.replace(docs + '/', './'))
  }
  return acc
}

console.log('\nMarkdown files:')
walk(docs).sort().forEach((f) => console.log(f))