# Release Checklist — v1.0.0-rc.1

> RC-гейт перед Bug Bash. Полный launch-гейт: [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md).

---

## Pre-tag (B-1)

- [x] Audit 22 P0 fixes в рабочем дереве
- [x] Pipeline green: typecheck / lint 0 errors / test 45/45 / build
- [ ] `git add -A && git commit` — **выполнить:** `bash scripts/commit-rc.sh`
- [ ] Annotated tag `v1.0.0-rc.1`
- [ ] `git status` — clean working tree

## Documentation (B-2 + RC)

- [x] [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md) — KL-1 (ISR vs market display)
- [x] [Release Notes](releases/v1.0.0-rc.1.md)
- [x] [MASTER_STATUS.md](MASTER_STATUS.md)
- [x] [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) — section D (LV-only acceptance)

## Post-tag verification

```bash
git checkout v1.0.0-rc.1
pnpm install
pnpm typecheck && pnpm test && pnpm build
git show v1.0.0-rc.1:app/actions/stripe.ts | grep resolveMarketFromCookies
```

Ожидается: `resolveMarketFromCookies` присутствует в tagged checkout path.

## Sign-off

| Роль | Имя | Дата | RC approved |
|------|-----|------|-------------|
| Engineering | | | [ ] |
| QA (Bug Bash) | | | [ ] |