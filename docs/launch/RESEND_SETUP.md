# Resend Setup — pharm.lv

> Transactional email для order confirmations и (через Supabase SMTP) auth emails.
>
> Google Workspace, Gmail, MX и corporate aliases уже завершены. Следующий email milestone — Resend и domain authentication; Workspace повторно не настраивать.

---

## Что настраивает Resend

| Тип письма | From address | Триггер |
|------------|--------------|---------|
| Order confirmation | `Pharm.lv <orders@pharm.lv>` | Stripe webhook → `fulfillOrder` |
| Password reset | `noreply@pharm.lv` | Supabase Auth SMTP |
| Email confirm | `noreply@pharm.lv` | Supabase Auth SMTP |

---

## 1. Создать аккаунт и API key

1. [resend.com](https://resend.com) → Sign up
2. **API Keys** → **Create API Key**
   - Name: `pharmiperia-production`
   - Permission: **Sending access**
   - Domain: restrict to `pharm.lv` (если доступно)
3. Скопировать key: `re_...` — **показывается один раз**

| Куда вставить | Переменная |
|---------------|------------|
| Vercel Production | `RESEND_API_KEY=re_...` |
| Supabase Dashboard → Auth → SMTP | Password field (= API key) |

---

## 2. Добавить домен

1. Resend Dashboard → **Domains** → **Add Domain**
2. Ввести: `pharm.lv` (apex, не subdomain)
3. Region: **EU (Ireland)** — если доступен; иначе default
4. Resend покажет DNS-записи для верификации

### Типичные записи Resend

| Type | Host | Value | Примечание |
|------|------|-------|------------|
| `TXT` | `resend._domainkey` | `p=MIGfMA0GCS...` | **значение берётся из Resend** |
| `TXT` | `@` | `v=spf1 include:amazonses.com ~all` | Может быть частью combined SPF — см. [EMAIL_SETUP.md](./EMAIL_SETUP.md) |
| `CNAME` | `resend` (или per UI) | `xxx.dkim.resend.dev` | Если Resend запрашивает — **значение из Resend UI** |

> Точный набор записей **всегда берите из Resend Dashboard** после Add Domain. UI может отличаться от таблицы.

### Действия владельца

1. Скопировать каждую запись из Resend → NIC.lv DNS (или Cloudflare)
2. Вернуться в Resend → **Verify DNS Records**
3. Дождаться статуса: **Verified** ✅

---

## 3. From address

| Поле | Значение |
|------|----------|
| Display name | `Pharm.lv` |
| Email | `orders@pharm.lv` |
| Полный формат | `Pharm.lv <orders@pharm.lv>` |

Это значение для env:

```
EMAIL_FROM=Pharm.lv <orders@pharm.lv>
```

---

## 4. Environment variables (Production)

| Variable | Value | Required |
|----------|-------|----------|
| `RESEND_API_KEY` | `re_...` | ✅ |
| `EMAIL_FROM` | `Pharm.lv <orders@pharm.lv>` | ✅ |
| `EMAIL_ENABLED` | `true` | ✅ |
| `AUTH_EMAIL_ADDRESS` | `noreply@pharm.lv` | ✅ (Supabase SMTP sender) |

### Staging vs Production

| | Staging | Production |
|---|---------|------------|
| API key | Отдельный `re_..._staging` | `re_..._production` |
| Domain | Можно `staging.pharm.lv` или Resend sandbox | `pharm.lv` verified |
| `EMAIL_ENABLED` | `true` для тестов | `true` |

---

## 5. Supabase Auth SMTP (Resend)

В **Supabase Dashboard** → Project → **Authentication** → **SMTP Settings**:

| Field | Value |
|-------|-------|
| Enable custom SMTP | ✅ On |
| Host | `smtp.resend.com` |
| Port | `587` |
| Username | `resend` |
| Password | `re_...` (same `RESEND_API_KEY`) |
| Sender email | `noreply@pharm.lv` |
| Sender name | `Pharm.lv` |

Auth redirect URLs — см. [SUPABASE_PRODUCTION_SETUP.md](./SUPABASE_PRODUCTION_SETUP.md).

---

## 6. Проверка доставки

### Test 1 — Resend Dashboard

1. Resend → **Emails** → **Send test email**
2. From: `orders@pharm.lv`
3. To: личный Gmail
4. Проверить: inbox (не spam), DKIM pass, From = `Pharm.lv <orders@pharm.lv>`

### Test 2 — Production order flow

1. Staging/production: оформить заказ с test card (Stripe test mode на staging)
2. После webhook `checkout.session.completed` → order confirmation email
3. Проверить: правильный order number, сумма, ссылка на `https://pharm.lv`

### Test 3 — Password reset

1. `https://pharm.lv/lv/auth/forgot-password` (или `/ru/...`)
2. Ввести email зарегистрированного пользователя
3. Письмо от `noreply@pharm.lv` → ссылка ведёт на `/auth/callback?next=/lv/auth/update-password`

### Troubleshooting

| Симптом | Действие |
|---------|----------|
| Domain not verified | Проверить `dig TXT resend._domainkey.pharm.lv` |
| SPF fail | Объединить Google + Resend в одном SPF TXT |
| 403 from Resend API | Проверить `RESEND_API_KEY` и domain restriction |
| Auth email не приходит | Supabase SMTP settings + `AUTH_EMAIL_ADDRESS` |

---

## 7. Связь с production env

Порядок:

1. ✅ DNS records для Resend verified
2. ✅ `RESEND_API_KEY` в Vercel Production
3. ✅ `EMAIL_FROM` + `EMAIL_ENABLED=true`
4. ✅ Supabase SMTP configured
5. Deploy `v1.0.0-rc.2` → smoke test

---

## Статус

| Пункт | Статус |
|-------|--------|
| Resend account created | ⬜ Не выполнено |
| Domain `pharm.lv` added | ⬜ Не выполнено |
| DNS verified | ⬜ Не выполнено |
| API key in Vercel | ⬜ Не выполнено |
| Test email delivered | ⬜ Не выполнено |
| Supabase SMTP configured | ⬜ Не выполнено |
