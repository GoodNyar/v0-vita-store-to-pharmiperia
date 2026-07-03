"use client"

import { useEffect } from "react"
import { useLang } from "@/lib/i18n"

/** Sync `<html lang>` with the active locale from the URL (ADR-0003). */
export function LocaleHtmlLang() {
  const { lang } = useLang()

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return null
}