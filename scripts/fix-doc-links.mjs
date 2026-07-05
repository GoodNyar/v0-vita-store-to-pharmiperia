#!/usr/bin/env node
/**
 * Fix relative links after docs/ reorganization.
 * Run: node scripts/fix-doc-links.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const docs = join(root, 'docs')

const replacements = [
  ['docs/reports/05-cto-roadmap-12-mesyacev.md', 'docs/roadmap/CTO-roadmap.md'],
  ['docs/reports/phase-1-final-summary.md', 'docs/roadmap/phase-1.md'],
  ['docs/reports/phase-2-final-summary.md', 'docs/roadmap/phase-2.md'],
  ['docs/reports/phase-3-final-summary.md', 'docs/roadmap/phase-3.md'],
  ['docs/reports/phase-4-final-summary.md', 'docs/roadmap/phase-4.md'],
  ['docs/reports/phase-5-final-summary.md', 'docs/roadmap/phase-5.md'],
  ['docs/reports/phase-6-final-summary.md', 'docs/roadmap/phase-6.md'],
  ['docs/reports/phase-2-master-plan.md', 'docs/roadmap/phase-2-master-plan.md'],
  ['docs/reports/phase-3-master-plan.md', 'docs/roadmap/phase-3-master-plan.md'],
  ['docs/reports/phase-4-prerequisites.md', 'docs/roadmap/phase-4-prerequisites.md'],
  ['docs/ENGINEERING_PLAYBOOK.md', 'docs/architecture/ENGINEERING_PLAYBOOK.md'],
  ['docs/MASTER_STATUS.md', 'docs/release/MASTER_STATUS.md'],
  ['docs/KNOWN_LIMITATIONS.md', 'docs/release/KNOWN_LIMITATIONS.md'],
  ['docs/LAUNCH_CHECKLIST.md', 'docs/release/LAUNCH_CHECKLIST.md'],
  ['docs/RELEASE_CHECKLIST.md', 'docs/release/RELEASE_CHECKLIST.md'],
  ['docs/releases/v1.0.0-rc.1.md', 'docs/release/v1.0.0-rc.1.md'],
  ['docs/reports/06-refactoring-blueprint.md', 'docs/reports/history/06-refactoring-blueprint.md'],
  ['docs/reports/11-phase-1-production-validation.md', 'docs/reports/audits/11-phase-1-production-validation.md'],
  ['docs/reports/12-nezavisimyj-audit-post-phase-2.md', 'docs/reports/audits/12-nezavisimyj-audit-post-phase-2.md'],
  ['docs/reports/04-production-readiness-audit.md', 'docs/reports/reviews/production-readiness-audit.md'],
  ['docs/reports/07-staff-level-code-review.md', 'docs/reports/reviews/staff-level-code-review.md'],
  ['docs/reports/08-biznes-plan.md', 'docs/business/business-plan.md'],
  ['../reports/05-cto-roadmap-12-mesyacev.md', '../roadmap/CTO-roadmap.md'],
  ['../reports/06-refactoring-blueprint.md', '../reports/history/06-refactoring-blueprint.md'],
  ['(reports/23-final-release-candidate-audit.md)', '(../reports/audits/23-final-release-candidate-audit.md)'],
  ['[reports/23-final-release-candidate-audit.md]', '[../reports/audits/23-final-release-candidate-audit.md]'],
  ['(reports/22-nezavisimyj-audit-phase-6.md)', '(../reports/audits/22-nezavisimyj-audit-phase-6.md)'],
  ['[Release Notes](../releases/', '[Release Notes](../release/'],
  ['[KNOWN_LIMITATIONS.md](../KNOWN_LIMITATIONS.md)', '[KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md)'],
  ['[LAUNCH_CHECKLIST.md](../LAUNCH_CHECKLIST.md)', '[LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)'],
  ['[MASTER_STATUS.md](../MASTER_STATUS.md)', '[MASTER_STATUS.md](MASTER_STATUS.md)'],
  ['[RELEASE_CHECKLIST.md](../RELEASE_CHECKLIST.md)', '[RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md)'],
  ['phase-1-final-summary.md', 'phase-1.md'],
  ['phase-2-final-summary.md', 'phase-2.md'],
  ['phase-3-final-summary.md', 'phase-3.md'],
  ['phase-4-final-summary.md', 'phase-4.md'],
  ['phase-5-final-summary.md', 'phase-5.md'],
  ['phase-6-final-summary.md', 'phase-6.md'],
  ['05-cto-roadmap-12-mesyacev.md', 'CTO-roadmap.md'],
  ['phase-4-prerequisites.md', 'phase-4-prerequisites.md'], // noop safety
  ['docs/reports/phase-4-prerequisites.md', 'docs/roadmap/phase-4-prerequisites.md'],
  ['See docs/reports/phase-3-final-summary.md', 'See docs/roadmap/phase-3.md'],
  ['See docs/reports/phase-4-final-summary.md', 'See docs/roadmap/phase-4.md'],
  ['See docs/reports/phase-5-final-summary.md', 'See docs/roadmap/phase-5.md'],
  ['See docs/reports/phase-6-final-summary.md', 'See docs/roadmap/phase-6.md'],
  ['and phase-4-prerequisites.md', 'and docs/roadmap/phase-4-prerequisites.md'],
]

function walk(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) {
      if (e === 'node_modules' || e === '.next') continue
      walk(p, acc)
    } else if (/\.(md|sh|mjs)$/.test(e)) acc.push(p)
  }
  return acc
}

const targets = [
  ...walk(docs),
  join(root, 'README.md'),
  ...['tag-phase-3.sh', 'tag-phase-4.sh', 'tag-phase-5.sh', 'tag-phase-6.sh', 'commit-rc.sh'].map(
    (f) => join(root, 'scripts', f)
  ),
]

let changed = 0
for (const file of targets) {
  let text = readFileSync(file, 'utf8')
  let next = text
  for (const [from, to] of replacements) {
    next = next.split(from).join(to)
  }
  if (next !== text) {
    writeFileSync(file, next)
    changed++
    console.log('fixed:', file.replace(root + '/', ''))
  }
}
console.log(`\n${changed} files updated`)