# Ответ NIC.lv по MX для Resend

> Статус: **ответ получен, MX опубликован** · Обновлено: 2026-07-07 · Тикет: **NIC.lv #921631**

## Что уже выполнено

- Google Workspace полностью завершён и больше не требует перенастройки.
- Корпоративный ящик `admin@pharm.lv` работает.
- Все корпоративные alias-адреса настроены; входящая почта была проверена.
- Resend domain `pharm.lv` создан в регионе `eu-west-1`.
- Resend MX для `send.pharm.lv` опубликован NIC.lv:
  - owner: `send.pharm.lv`;
  - target: `feedback-smtp.eu-west-1.amazonses.com`;
  - priority: `10`.
- Resend SPF опубликован для `send.pharm.lv`.
- DMARC опубликован для `_dmarc.pharm.lv`.
- Supabase Email подготовлен:
  - экран custom SMTP найден;
  - шаблон подтверждения регистрации установлен;
  - шаблон восстановления пароля установлен;
  - код приложения и конфигурация email-слоя готовы.

## Текущий технический статус

NIC.lv ответил по тикету **#921631** и внёс MX-запись для `send.pharm.lv`. Публичная DNS-проверка уже подтверждает:

```txt
send.pharm.lv. MX 10 feedback-smtp.eu-west-1.amazonses.com.
send.pharm.lv. TXT "v=spf1 include:amazonses.com ~all"
_dmarc.pharm.lv. TXT "v=DMARC1; p=none;"
```

При повторной проверке Resend обнаружил одну ошибку в DKIM TXT: в DNS было опубликовано `...MDUE/3...`, а Resend ожидает `...MDUe/3...`.

Исправление DKIM сохранено в панели NIC.lv 2026-07-07. В момент обновления документации панель NIC.lv уже показывает правильное значение, но авторитативный DNS `ns1.dns.lv` ещё отдаёт старую версию. Это ожидаемое окно публикации зоны.

## Что осталось

1. Дождаться, пока авторитативный DNS начнёт отдавать исправленный DKIM:

   ```bash
   dig @ns1.dns.lv +short TXT resend._domainkey.pharm.lv
   dig +short TXT resend._domainkey.pharm.lv
   ```

2. Перезапустить проверку DNS в Resend и дождаться статуса **Verified** для `pharm.lv`.
3. Создать production API key в Resend с минимальными правами отправки и, если Resend позволит, ограничением на домен `pharm.lv`.
4. Добавить production email variables/secrets в Vercel.
5. Заменить временные Supabase SMTP credentials на production Resend credentials.
6. Запустить smoke-тесты transactional/auth email и production validators.

## Блокеры

Внешний блокер **NIC.lv #921631 снят**: MX для `send.pharm.lv` создан.

Текущий временный стоп-фактор — только DNS-публикация исправленного DKIM. Нового обращения в NIC.lv пока не требуется, если исправленное значение появится в авторитативном DNS в обычное окно публикации.

## Продолжить после DNS-публикации DKIM

После появления `MDUe/3` в публичном DNS:

1. Открыть Resend → Domains → `pharm.lv`.
2. Нажать restart/verify DNS verification.
3. Убедиться, что DKIM, SPF и MX стали passing.
4. Перейти к production API key, Vercel secrets и Supabase SMTP по инструкции [EMAIL_PRODUCTION_SETUP.md](../infrastructure/EMAIL_PRODUCTION_SETUP.md).
