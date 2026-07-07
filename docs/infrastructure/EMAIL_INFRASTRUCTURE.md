# Email Infrastructure — pharm.lv

> Статус: **NIC.lv MX выполнен; ждём DNS-публикацию исправленного DKIM** · Обновлено: 2026-07-07

## Архитектура

| Слой | Провайдер | Назначение |
|---|---|---|
| Корпоративная почта | Google Workspace Business Starter | Входящая/исходящая почта команды |
| Основной аккаунт | `admin@pharm.lv` | Admin Console, mailbox и точка назначения alias-адресов |
| Transactional email | Resend | Домен создан; SPF/MX/DMARC опубликованы; DKIM исправлен в NIC и ожидает DNS-публикацию |
| Auth email | Supabase Auth через Resend SMTP | Hosted templates установлены; production credentials ещё не включены |

Google Workspace и Resend остаются разными delivery path. Все alias-адреса сейчас ведут во входящую почту `admin@pharm.lv`; application secrets хранятся только в Vercel/Supabase и не попадают в репозиторий.

## Адреса

| Адрес | Назначение |
|---|---|
| `admin@pharm.lv` | Основной mailbox и инфраструктурное администрирование |
| `support@pharm.lv` | Поддержка клиентов |
| `orders@pharm.lv` | Переписка по заказам и transactional sender |
| `noreply@pharm.lv` | Auth/system sender; ответы не ожидаются |
| `info@pharm.lv` | Общие вопросы |
| `sales@pharm.lv` | Коммерческие запросы |
| `returns@pharm.lv` | Возвраты и refund-переписка |
| `privacy@pharm.lv` | GDPR и data-subject requests |
| `legal@pharm.lv` | Юридические уведомления |
| `jobs@pharm.lv` | Найм |
| `marketing@pharm.lv` | Маркетинговые запросы |
| `finance@pharm.lv` | Биллинг и финансы |

## Текущий статус

- Google Workspace: полностью завершён.
- Gmail: активирован; Google MX для основной почты работает.
- `admin@pharm.lv`: operational.
- Все alias-адреса выше настроены и ведут в основной mailbox.
- Входящая почта успешно проверена на `support@pharm.lv` и `orders@pharm.lv`.
- Google Workspace больше не перенастраивать.
- Resend Domain `pharm.lv` существует в регионе `eu-west-1`.
- Resend MX для `send.pharm.lv` опубликован NIC.lv и виден публично.
- Resend SPF для `send.pharm.lv` виден публично.
- DMARC для `_dmarc.pharm.lv` виден публично.
- DKIM TXT для `resend._domainkey.pharm.lv` исправлен в панели NIC.lv; ожидается публикация исправления в авторитативном DNS.
- Supabase signup-confirmation и password-reset templates установлены.

## Состояние NIC.lv #921631

Тикет **NIC.lv #921631** снял исходный блокер: NIC.lv добавил MX для `send.pharm.lv` без изменения root Google MX.

Текущий pause-point описан в [WAITING_FOR_NICLV.md](../status/WAITING_FOR_NICLV.md): дождаться DNS-публикации исправленного DKIM, затем завершить Resend verification и production activation по [EMAIL_PRODUCTION_SETUP.md](EMAIL_PRODUCTION_SETUP.md).
