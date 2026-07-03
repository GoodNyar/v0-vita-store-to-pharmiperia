import 'server-only'

import type { Locale } from '@/lib/i18n/config'

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function buildTransactionalEmailHtml(params: {
  locale: Locale
  preview: string
  title: string
  bodyHtml: string
  cta?: { href: string; label: string }
  footer: string
  supportText: string
  supportEmail: string
}): string {
  const { locale, preview, title, bodyHtml, cta, footer, supportText, supportEmail } = params

  return `<!DOCTYPE html>
<html lang="${locale}">
  <body style="margin:0;padding:0;background:#f6f7f9;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
    <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(preview)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7f9;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:12px;padding:32px 28px;">
            <tr>
              <td>
                <p style="margin:0 0 8px;font-size:13px;color:#6b7280;letter-spacing:0.04em;text-transform:uppercase;">Pharmiperia</p>
                <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;">${escapeHtml(title)}</h1>
                ${bodyHtml}
                ${
                  cta
                    ? `<a href="${cta.href}" style="display:inline-block;background:#0f766e;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:600;margin-top:8px;">${escapeHtml(cta.label)}</a>`
                    : ''
                }
                <p style="margin:28px 0 0;font-size:13px;line-height:1.5;color:#6b7280;">
                  ${escapeHtml(supportText)}
                  <a href="mailto:${supportEmail}" style="color:#0f766e;">${supportEmail}</a>
                </p>
                <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;">${escapeHtml(footer)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}