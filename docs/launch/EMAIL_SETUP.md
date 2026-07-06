# Email Setup — pharm.lv

> **Домен:** `pharm.lv`  
> **Рекомендуемый провайдер v1.0:** **Google Workspace**
>
> **Текущий статус:** Business Starter, Gmail, MX, `admin@pharm.lv` и aliases настроены. Открыты только SPF/DKIM/DMARC и Resend.

---

## Сравнение провайдеров

| Критерий | Google Workspace | Microsoft 365 | Zoho Mail |
|----------|------------------|---------------|-----------|
| Надёжность доставки | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| EU/GDPR | DPA available | DPA available | DPA available |
| Админка / aliases | Отличная | Хорошая | Базовая |
| Интеграция с Resend SPF | Простая (include) | Простая | Простая |
| Цена (1 user) | ~€6–8/мес | ~€6–10/мес | ~€1–3/мес |
| Mobile/desktop apps | Gmail, Calendar | Outlook | Zoho Mail |
| Поддержка LV SMB | Широко используется | Корпоративный стандарт | Бюджетный вариант |

### Рекомендация: Google Workspace

**Почему для v1.0:**

1. **Один primary mailbox** (`admin@`) + неограниченные aliases — дешевле, чем 5 отдельных ящиков
2. **Gmail UI** — привычен для support; легко делегировать доступ
3. **SPF/DKIM** — хорошо документированы; совместимы с Resend в одном SPF
4. **Calendar/Drive** — полезны для ops без дополнительных сервисов
5. Широко используется в EU e-commerce SMB

Zoho — если бюджет критичен. M365 — если команда уже на Microsoft ecosystem.

---

## Адреса pharm.lv

| Адрес | Тип | Назначение |
|-------|-----|------------|
| `admin@pharm.lv` | **Primary mailbox** | Владелец; вход в Google Admin |
| `info@pharm.lv` | Alias → `admin@` | Контакты на сайте, общие вопросы |
| `support@pharm.lv` | Alias → `admin@` (или отдельный mailbox позже) | Customer support, `SUPPORT_EMAIL` в коде |
| `orders@pharm.lv` | Alias → `admin@` | Resend `EMAIL_FROM`, order confirmations |
| `privacy@pharm.lv` | Alias → `admin@` | GDPR/privacy страницы, DSR запросы |
| `noreply@pharm.lv` | Alias → `admin@` + sender identity | Auth emails (reset password, confirm) |
| `sales@pharm.lv` | Alias → `admin@` | Коммерческие запросы |
| `returns@pharm.lv` | Alias → `admin@` | Возвраты |
| `legal@pharm.lv` | Alias → `admin@` | Юридические уведомления |
| `jobs@pharm.lv` | Alias → `admin@` | Вакансии |
| `marketing@pharm.lv` | Alias → `admin@` | Маркетинг |
| `finance@pharm.lv` | Alias → `admin@` | Финансы и счета |

### Правила

| Категория | Адреса | Почему |
|-----------|--------|--------|
| **Реальный mailbox** | `admin@pharm.lv` | Нужен логин, 2FA, Admin Console |
| **Aliases (достаточно для v1.0)** | `info@`, `support@`, `orders@`, `privacy@` | Приходят в `admin@`; отдельные ящики не нужны на старте |
| **Только отправка (Resend)** | `orders@pharm.lv`, `noreply@pharm.lv` | Resend верифицирует домен; inbox для них не обязателен |
| **Юридические страницы** | `privacy@pharm.lv`, `info@pharm.lv` | Должны быть рабочими (alias OK) |
| **Customer support** | `support@pharm.lv` | Должен принимать почту (alias → admin) |

---

## Google Workspace — пошаговая настройка

### 1. Регистрация

1. Перейти на [Google Workspace](https://workspace.google.com/)
2. **Start free trial** → домен `pharm.lv`
3. Создать **первого пользователя:** `admin@pharm.lv`
4. Выбрать план: **Business Starter** (достаточно для v1.0)

### 2. Верификация домена

Google предложит один из методов:

| Метод | Запись | Где добавить |
|-------|--------|--------------|
| TXT verify | `google-site-verification=XXXXXXXX` | NIC.lv DNS (или Cloudflare) |
| CNAME verify | `XXXXXXXX.dv.googlehosted.com` | NIC.lv DNS |

**Действие:** скопировать значение из Google Admin → вставить в DNS → **Verify** в Google Admin.

### 3. MX-записи

После верификации Google покажет MX. Типичный набор (приоритеты важны):

| Priority | Mail server |
|----------|-------------|
| 1 | `ASPMX.L.GOOGLE.COM` |
| 5 | `ALT1.ASPMX.L.GOOGLE.COM` |
| 5 | `ALT2.ASPMX.L.GOOGLE.COM` |
| 10 | `ALT3.ASPMX.L.GOOGLE.COM` |
| 10 | `ALT4.ASPMX.L.GOOGLE.COM` |

**NIC.lv:** Tips = `MX`, Vārds = `@`, Vertība = `ASPMX.L.GOOGLE.COM`, Priority = `1` (повторить для каждого).

### 4. SPF (TXT на `@`)

Объединённый SPF для Google + Resend:

```
v=spf1 include:_spf.google.com include:amazonses.com ~all
```

> `include:amazonses.com` — Resend использует Amazon SES infrastructure.  
> Если Resend Dashboard показывает другой SPF include — **используйте значение из Resend** и объедините с Google.

**Альтернатива (только Google, до Resend):**

```
v=spf1 include:_spf.google.com ~all
```

После добавления Resend — обновить SPF, включив оба `include`.

### 5. DKIM (Google)

1. Google Admin → **Apps → Google Workspace → Gmail → Authenticate email**
2. Нажать **Generate new record** для `pharm.lv`
3. Скопировать TXT-запись:

| Type | Host | Value |
|------|------|-------|
| `TXT` | `google._domainkey` | **значение берётся из Google Workspace** |

4. Добавить в NIC.lv DNS → **Start authentication** в Google Admin

### 6. DMARC

| Type | Host | Value |
|------|------|-------|
| `TXT` | `_dmarc` | `v=DMARC1; p=none; rua=mailto:admin@pharm.lv; pct=100` |

После 2–4 недель стабильной доставки — повысить до `p=quarantine` или `p=reject`.

### 7. Aliases

Google Admin → **Users → admin@pharm.lv → User information → Email aliases**:

- `info@pharm.lv`
- `support@pharm.lv`
- `orders@pharm.lv`
- `privacy@pharm.lv`
- `noreply@pharm.lv`
- `sales@pharm.lv`
- `returns@pharm.lv`
- `legal@pharm.lv`
- `jobs@pharm.lv`
- `marketing@pharm.lv`
- `finance@pharm.lv`

### 8. Проверка

| Тест | Как |
|------|-----|
| Inbound | Отправить на `support@pharm.lv` с личной почты → письмо в `admin@` inbox |
| Outbound | Отправить из Gmail как `support@pharm.lv` (Send mail as) |
| SPF/DKIM | [mail-tester.com](https://www.mail-tester.com) — score ≥ 9/10 |
| Google Admin | **MX status: Configured correctly** |

---

## DNS-таблица email (сводная)

| Type | Host | Value | Источник |
|------|------|-------|----------|
| `MX` | `@` | `1 ASPMX.L.GOOGLE.COM` (+ ALT servers) | Google Workspace setup wizard |
| `TXT` | `@` | `v=spf1 include:_spf.google.com include:amazonses.com ~all` | Скомбинировать Google + Resend |
| `TXT` | `google._domainkey` | `v=DKIM1; k=rsa; p=...` | **значение берётся из Google Workspace** |
| `TXT` | `_dmarc` | `v=DMARC1; p=none; rua=mailto:admin@pharm.lv` | Этот документ |
| `TXT` | `resend._domainkey` | `p=...` | **значение берётся из Resend** — см. [RESEND_SETUP.md](./RESEND_SETUP.md) |

> **Не придумывайте DKIM-ключи.** Каждый провайдер выдаёт уникальные значения в своей панели.

---

## Связь с приложением

| Env var | Значение production |
|---------|---------------------|
| `SUPPORT_EMAIL` | `support@pharm.lv` |
| `INFO_EMAIL` | `info@pharm.lv` |
| `ORDERS_EMAIL` | `orders@pharm.lv` |
| `EMAIL_FROM` | `Pharm.lv <orders@pharm.lv>` |
| `AUTH_EMAIL_ADDRESS` | `noreply@pharm.lv` |

---

## Статус

| Пункт | Статус |
|-------|--------|
| Google Workspace создан | ✅ Выполнено |
| MX настроены | ✅ Выполнено |
| SPF/DKIM/DMARC active | ⬜ Не выполнено |
| Aliases созданы | ✅ Выполнено (11) |
| Inbound test pass | ✅ `support@`, `orders@` |
