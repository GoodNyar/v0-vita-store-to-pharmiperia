# Release Checklist — v1.0.0-rc.2

> RC-гейт после BUGFIX-01 + BUGFIX-01B. Полный launch-гейт: [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md).

---

## Pre-tag (rc.2)

- [x] BUGFIX-01 (7 P0/P1 bugs) — [bugfix-01-report.md](../releases/bugfix-01-report.md)
- [x] BUGFIX-01B (отчёт 24 partials: 001B, 003B, 005B) — [bugfix-01b-report.md](../releases/bugfix-01b-report.md)
- [x] Pipeline: typecheck / lint 0 errors / test 47/47 / build
- [ ] Annotated tag `v1.0.0-rc.2`
- [ ] `git status` — clean working tree

## Post-tag verification

```bash
git checkout v1.0.0-rc.2
pnpm install
pnpm typecheck && pnpm lint && pnpm test && pnpm build
supabase db reset   # применяет 24 миграции incl. merge_cart_item_atomic
```

## Sign-off

| Роль | Имя | Дата | RC approved |
|------|-----|------|-------------|
| Engineering | | | [ ] |
| QA (staging Bug Bash) | | | [ ] |