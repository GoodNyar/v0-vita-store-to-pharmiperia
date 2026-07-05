#!/usr/bin/env bash
# Reorganize docs/ — run once. Idempotent via existence checks.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/docs"

mv_if() {
  local src="$1" dst="$2"
  if [[ -f "$src" ]]; then
    mkdir -p "$(dirname "$dst")"
    if [[ ! -f "$dst" ]]; then
      git mv "$src" "$dst" 2>/dev/null || mv "$src" "$dst"
    fi
  fi
}

# Directories
mkdir -p architecture roadmap release business operations/runbooks \
  reports/audits reports/reviews reports/history archive

# Architecture
mv_if ENGINEERING_PLAYBOOK.md architecture/ENGINEERING_PLAYBOOK.md

# Release
mv_if MASTER_STATUS.md release/MASTER_STATUS.md
mv_if LAUNCH_CHECKLIST.md release/LAUNCH_CHECKLIST.md
mv_if KNOWN_LIMITATIONS.md release/KNOWN_LIMITATIONS.md
mv_if RELEASE_CHECKLIST.md release/RELEASE_CHECKLIST.md
mv_if releases/v1.0.0-rc.1.md release/v1.0.0-rc.1.md
rmdir releases 2>/dev/null || true

# Roadmap
mv_if reports/05-cto-roadmap-12-mesyacev.md roadmap/CTO-roadmap.md
mv_if reports/phase-1-final-summary.md roadmap/phase-1.md
mv_if reports/phase-2-final-summary.md roadmap/phase-2.md
mv_if reports/phase-2-master-plan.md roadmap/phase-2-master-plan.md
mv_if reports/phase-2-prerequisites.md roadmap/phase-2-prerequisites.md
mv_if reports/phase-3-final-summary.md roadmap/phase-3.md
mv_if reports/phase-3-master-plan.md roadmap/phase-3-master-plan.md
mv_if reports/phase-4-final-summary.md roadmap/phase-4.md
mv_if reports/phase-4-prerequisites.md roadmap/phase-4-prerequisites.md
mv_if reports/phase-5-final-summary.md roadmap/phase-5.md
mv_if reports/phase-5-master-plan.md roadmap/phase-5-master-plan.md
mv_if reports/phase-6-final-summary.md roadmap/phase-6.md
mv_if reports/phase-6-master-plan.md roadmap/phase-6-master-plan.md

# Business
mv_if reports/08-biznes-plan.md business/business-plan.md
mv_if reports/09-finansovaya-model-36-mesyacev.md business/financial-model.md
mv_if reports/10-vc-due-diligence.md business/VC-due-diligence.md

# Reviews
mv_if reports/07-staff-level-code-review.md reports/reviews/staff-level-code-review.md
mv_if reports/04-production-readiness-audit.md reports/reviews/production-readiness-audit.md

# History
mv_if reports/01-struktura-proekta.md reports/history/01-struktura-proekta.md
mv_if reports/02-glubokij-analiz-i-54-uluchsheniya.md reports/history/02-glubokij-analiz-i-54-uluchsheniya.md
mv_if reports/03-arhitekturnyj-audit-masshtabiruemosti.md reports/history/03-arhitekturnyj-audit-masshtabiruemosti.md
mv_if reports/06-refactoring-blueprint.md reports/history/06-refactoring-blueprint.md

# Audits
mv_if reports/11-phase-1-production-validation.md reports/audits/11-phase-1-production-validation.md
mv_if reports/12-nezavisimyj-audit-post-phase-2.md reports/audits/12-nezavisimyj-audit-post-phase-2.md
mv_if reports/13-self-audit-phase-3.md reports/audits/13-self-audit-phase-3.md
mv_if reports/14-claude-audit-brief.md reports/audits/14-claude-audit-brief.md
mv_if reports/15-nezavisimyj-audit-phase-3.md reports/audits/15-nezavisimyj-audit-phase-3.md
mv_if reports/17-nezavisimyj-audit-phase-4.md reports/audits/17-nezavisimyj-audit-phase-4.md
mv_if reports/18-zero-trust-production-audit-phase-4.md reports/audits/18-zero-trust-production-audit-phase-4.md
mv_if reports/19-self-audit-phase-5.md reports/audits/19-self-audit-phase-5.md
mv_if reports/20-nezavisimyj-audit-phase-5.md reports/audits/20-nezavisimyj-audit-phase-5.md
mv_if reports/21-self-audit-phase-6.md reports/audits/21-self-audit-phase-6.md
mv_if reports/22-nezavisimyj-audit-phase-6.md reports/audits/22-nezavisimyj-audit-phase-6.md
mv_if reports/23-final-release-candidate-audit.md reports/audits/23-final-release-candidate-audit.md

# Archive (superseded)
mv_if reports/16-self-audit-phase-4.md archive/16-self-audit-phase-4.md
mv_if reports/phase-2-progress.md archive/phase-2-progress.md

echo "Docs reorganized."
find . -type f -name '*.md' | sort