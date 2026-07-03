"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { usePathname, useRouter } from "next/navigation"
import { formatMoney, moneyFromMajorEUR } from "./money"
import { localizedPath as buildLocalizedPath, swapLocaleInPath } from "./i18n/routes"
import { applySitePlaceholders } from "./site"
import {
  productDescriptions,
  translations,
  type TranslationKey,
} from "./i18n/translations"

export { formatMoney } from "./money"
export { productDescriptions, translations, type TranslationKey } from "./i18n/translations"

export type Lang = "ru" | "lv"

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TranslationKey | string) => string
  /** Prefix an app path with the active locale, e.g. `/checkout` → `/lv/checkout`. */
  localizedPath: (path: string) => string
}

const LangContext = createContext<LangContextValue>({
  lang: "lv",
  setLang: () => {},
  t: (key) =>
    applySitePlaceholders(
      (translations.lv as Record<string, string>)[key] ?? String(key)
    ),
  localizedPath: (path) => path,
})

export function LangProvider({
  children,
  initialLang = "lv",
}: {
  children: ReactNode
  initialLang?: Lang
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [lang, setLangState] = useState<Lang>(initialLang)
  const [prevInitialLang, setPrevInitialLang] = useState(initialLang)

  if (initialLang !== prevInitialLang) {
    setPrevInitialLang(initialLang)
    setLangState(initialLang)
  }

  useEffect(() => {
    localStorage.setItem("preferredLang", lang)
  }, [lang])

  const localizedPath = useCallback(
    (path: string) => buildLocalizedPath(lang, path),
    [lang]
  )

  const setLang = (newLang: Lang) => {
    setLangState(newLang)
    localStorage.setItem("preferredLang", newLang)
    if (pathname) {
      router.push(swapLocaleInPath(pathname, newLang))
    }
  }

  const t = (key: TranslationKey | string): string => {
    const dict = translations[lang] as Record<string, string>
    return applySitePlaceholders(dict[key] ?? String(key))
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t, localizedPath }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}

/** @deprecated Prefer formatMoney from lib/money */
export function formatEur(amount: number): string {
  return formatMoney(moneyFromMajorEUR(amount))
}
