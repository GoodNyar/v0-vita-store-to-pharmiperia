"use client"

import { useState } from "react"
import { useCart } from "@/components/cart-context"
import { useLang } from "@/lib/i18n"
import { categories } from "@/lib/data"
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  ChevronDown,
  Leaf,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const { totalItems, setIsCartOpen } = useCart()
  const { lang, setLang, t } = useLang()
  const [searchValue, setSearchValue] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  // Map category id to translation key
  const getCategoryName = (id: string) => {
    const key = id as Parameters<typeof t>[0]
    try { return t(key) } catch { return id }
  }

  return (
    <header className="sticky top-0 z-30 bg-card shadow-sm">
      {/* Top bar */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{t("deliverTo")}</span>
            <span className="text-border">|</span>
            {/* Language switcher */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLang("ru")}
                className={`rounded px-1.5 py-0.5 text-xs font-semibold transition-colors ${
                  lang === "ru"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                RU
              </button>
              <span className="text-border">|</span>
              <button
                onClick={() => setLang("lv")}
                className={`rounded px-1.5 py-0.5 text-xs font-semibold transition-colors ${
                  lang === "lv"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                LV
              </button>
            </div>
            <span className="text-border">|</span>
            <span className="font-medium text-foreground">EUR</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="transition-colors hover:text-primary">
              {t("help")}
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              {t("trackOrder")}
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Mobile menu button */}
          <button
            className="lg:hidden rounded-lg p-2 text-foreground hover:bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Logo */}
          <a href="#" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Pharmiperia
            </span>
          </a>

          {/* Search Bar */}
          <div className="hidden flex-1 md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1 lg:gap-2">
            <button className="flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-foreground transition-colors hover:bg-muted md:hidden" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            <button className="hidden md:flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-foreground transition-colors hover:bg-muted" aria-label="Account">
              <User className="h-5 w-5" />
              <span className="text-[10px] text-muted-foreground">
                {t("signIn")}
              </span>
            </button>
            <button className="hidden md:flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-foreground transition-colors hover:bg-muted" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              <span className="text-[10px] text-muted-foreground">
                {t("wishlist")}
              </span>
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-foreground transition-colors hover:bg-muted"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute right-1 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                  {totalItems}
                </span>
              )}
              <span className="text-[10px] text-muted-foreground">
                {t("cart")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="hidden border-t border-border lg:block">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="flex items-center gap-0">
            {categories.map((category) => (
              <li
                key={category.id}
                className="relative"
                onMouseEnter={() => setActiveDropdown(category.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:text-primary">
                  {getCategoryName(category.id)}
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>

                {activeDropdown === category.id && (
                  <div className="absolute left-0 top-full z-50 min-w-[200px] rounded-lg border border-border bg-card py-2 shadow-lg">
                    {category.subcategories.map((sub) => (
                      <a
                        key={sub}
                        href="#"
                        className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
                      >
                        {sub}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
            <li>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium text-destructive hover:text-destructive"
              >
                {t("specials")}
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium text-primary hover:text-primary"
              >
                {t("bestSellers")}
              </Button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-card lg:hidden">
          <div className="px-4 py-3">
            <div className="relative mb-3">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("mobileSearchPlaceholder")}
                className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex flex-col">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href="#"
                  className="border-b border-border/50 py-3 text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  {getCategoryName(category.id)}
                </a>
              ))}
              <a href="#" className="py-3 text-sm font-medium text-destructive">
                {t("specials")}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
