"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useCart } from "@/components/cart-context"
import { useAuth } from "@/components/auth-provider"
import { useLang, type TranslationKey } from "@/lib/i18n"
import { useFavorites } from "@/components/favorites-provider"
import { categories, BRANDS_ORDERED, getBrandSlug } from "@/lib/data"
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

const isBrandName = (sub: string) => BRANDS_ORDERED.includes(sub)

import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const { totalItems, setIsCartOpen } = useCart()
  const { user, isLoading: authLoading } = useAuth()
  const { favorites } = useFavorites()
  const { lang, setLang, t, localizedPath } = useLang()
  const [searchValue, setSearchValue] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [expandedBrandsSection, setExpandedBrandsSection] = useState(false)

  const closeMenus = useCallback(() => {
    setActiveDropdown(null)
    setSidebarOpen(false)
    setMobileMenuOpen(false)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [closeMenus])

  const handleDropdownKeyDown = (
    event: React.KeyboardEvent<HTMLAnchorElement>,
    categoryId: string
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      setActiveDropdown((current) => (current === categoryId ? null : categoryId))
    }
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveDropdown(categoryId)
      const menu = event.currentTarget.parentElement?.querySelector<HTMLElement>(
        '[role="menu"] a, [role="menu"] button'
      )
      menu?.focus()
    }
    if (event.key === "Escape") {
      setActiveDropdown(null)
    }
  }

  // Map category id to translation key
  const getCategoryName = (id: string) => {
    const key = id as Parameters<typeof t>[0]
    try { return t(key) } catch { return id }
  }

  return (
    <>
    {/* Utility bar — NOT sticky, scrolls away naturally */}
    <div className="hidden border-b border-border bg-card md:block">
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
            <Link href={localizedPath("/help")} className="transition-colors hover:text-primary">
              {t("help")}
            </Link>
            <Link href={localizedPath("/track")} className="transition-colors hover:text-primary">
              {t("trackOrder")}
            </Link>
          </div>
        </div>
      </div>

    {/* Sticky container: PromoBar + MainBar + CategoryNav — constant height, no jitter */}
    <div className="sticky top-0 z-30">
    <header className="bg-card shadow-sm">

      {/* Main header */}
      <div className="mx-auto max-w-7xl px-4 py-2.5 lg:py-3">
        <div className="flex items-center gap-3 lg:gap-6">
          {/* Burger menu button - visible on all screens */}
          <button
            className="rounded-lg p-1.5 text-foreground hover:bg-muted"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            aria-expanded={sidebarOpen}
            aria-controls="site-sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link href={localizedPath("/")} className="flex items-center gap-1.5 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary lg:h-9 lg:w-9">
              <Leaf className="h-4 w-4 text-primary-foreground lg:h-5 lg:w-5" />
            </div>
            <span className="text-lg font-bold text-foreground lg:text-xl">
              Pharmiperia
            </span>
          </Link>

          {/* Search Bar — desktop only; mobile has its own row below */}
          <div className="hidden flex-1 md:block">
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                if (searchValue.trim()) {
                  window.location.href = localizedPath(`/search?q=${encodeURIComponent(searchValue.trim())}`)
                }
              }}
              className="relative"
            >
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </form>
          </div>

          {/* Right icons */}
          <div className="ml-auto flex items-center md:ml-0 lg:gap-1">
            {/* Account */}
            <Link
              href={localizedPath(user ? "/account" : "/auth/login")}
              className="flex flex-col items-center gap-0.5 rounded-lg p-2 text-foreground transition-colors hover:bg-muted md:px-3"
              aria-label={user ? t("account") : t("signIn")}
            >
              <User className={`h-5 w-5 ${user ? "text-primary fill-primary/20" : ""}`} />
              <span className={`text-[10px] hidden md:block ${user ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {authLoading ? "..." : user ? t("account") : t("signIn")}
              </span>
            </Link>
            {/* Favorites */}
            <Link
              href={localizedPath("/account/favorites")}
              className="relative flex flex-col items-center gap-0.5 rounded-lg p-2 text-foreground transition-colors hover:bg-muted md:px-3"
              aria-label={t("wishlist")}
            >
              <Heart className={`h-5 w-5 ${favorites.length > 0 ? "fill-red-500 text-red-500" : ""}`} />
              {favorites.length > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {favorites.length}
                </span>
              )}
              <span className="text-[10px] text-muted-foreground hidden md:block">{t("wishlist")}</span>
            </Link>
            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex flex-col items-center gap-0.5 rounded-lg p-2 text-foreground transition-colors hover:bg-muted md:px-3"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                  {totalItems}
                </span>
              )}
              <span className="text-[10px] text-muted-foreground hidden md:block">{t("cart")}</span>
            </button>
          </div>
        </div>

        {/* Mobile search bar — full width below logo/icons row */}
        <div className="mt-2 md:hidden">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (searchValue.trim()) {
                window.location.href = localizedPath(`/search?q=${encodeURIComponent(searchValue.trim())}`)
              }
            }}
            className="relative"
          >
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-11 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </form>
        </div>
      </div>

      {/* Category Navigation — always visible */}
      <nav className="hidden border-t border-border lg:block" aria-label={t("categories")}>
        <div>
          <div className="mx-auto max-w-7xl px-4">
            <ul className="flex items-center justify-center gap-0">
            {categories.map((category) => (
              <li
                key={category.id}
                className="relative"
                onMouseEnter={() => setActiveDropdown(category.id)}
                onMouseLeave={() => setActiveDropdown(null)}
                onFocusCapture={() => setActiveDropdown(category.id)}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setActiveDropdown(null)
                  }
                }}
              >
                <Link 
                  href={localizedPath(`/category/${category.id}`)}
                  className="flex items-center gap-1 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
                  aria-haspopup="true"
                  aria-expanded={activeDropdown === category.id}
                  onKeyDown={(event) => handleDropdownKeyDown(event, category.id)}
                >
                  {getCategoryName(category.id)}
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>

                {activeDropdown === category.id && (
                  <div
                    role="menu"
                    className="absolute left-0 top-full z-50 min-w-[200px] rounded-lg border border-border bg-card py-2 shadow-lg"
                  >
                    {category.id === "brands" ? (
                      BRANDS_ORDERED.map((brand) => (
                        <Link
                          key={brand}
                          role="menuitem"
                          href={localizedPath(`/brand/${getBrandSlug(brand)}`)}
                          className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground focus:bg-secondary focus:outline-none"
                        >
                          {brand}
                        </Link>
                      ))
                    ) : (
                      category.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          role="menuitem"
                          href={localizedPath(`/category/${category.id}?filter=${sub}`)}
                          className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground focus:bg-secondary focus:outline-none"
                        >
                          {t(sub as TranslationKey)}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </li>
            ))}
            <li>
              <Link href={localizedPath("/specials")}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium text-destructive hover:text-destructive"
                >
                  {t("specials")}
                </Button>
              </Link>
            </li>
            <li>
              <Link href={localizedPath("/popular")}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium text-primary hover:text-primary"
                >
                  {t("bestSellers")}
                </Button>
              </Link>
            </li>
          </ul>
        </div>
        </div>
      </nav>

    </header>
    </div>{/* end sticky */}

    {/* Sidebar Menu - slides from left */}
    {sidebarOpen && (
      <div 
        className="fixed inset-0 z-50 bg-black/30" 
        onClick={() => setSidebarOpen(false)}
      />
    )}
    <div
      id="site-sidebar"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className={`fixed top-0 left-0 z-50 h-full w-72 bg-card shadow-xl transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <Link href={localizedPath("/")} className="flex items-center gap-1.5" onClick={() => setSidebarOpen(false)}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">Pharmiperia</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="rounded-lg p-1.5 text-foreground hover:bg-muted"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Language switcher */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">{t("language")}:</span>
          <div className="flex items-center rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setLang("ru")}
              className={`px-3 py-1.5 text-sm font-semibold transition-colors ${
                lang === "ru"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              RU
            </button>
            <button
              onClick={() => setLang("lv")}
              className={`px-3 py-1.5 text-sm font-semibold transition-colors ${
                lang === "lv"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              LV
            </button>
          </div>
        </div>
      </div>

      {/* User Navigation */}
      <div className="border-b border-border p-4 space-y-1">
        {/* Account */}
        <Link
          href={user ? "/account" : "/auth/login"}
          className="flex items-center gap-3 py-3 px-2 border-b border-border/50 text-sm font-medium text-foreground hover:text-primary transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          <User className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <div>{user ? t("account") : t("signIn")}</div>
            {user && user.email && (
              <div className="text-xs text-muted-foreground">{user.email}</div>
            )}
          </div>
        </Link>

        {/* Favorites */}
        <Link
          href={localizedPath("/account/favorites")}
          className="flex items-center gap-3 py-3 px-2 border-b border-border/50 text-sm font-medium text-foreground hover:text-primary transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          <Heart className="h-5 w-5 text-muted-foreground" />
          <span className="flex-1">{t("wishlist")}</span>
          {favorites.length > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] rounded-full px-1.5 py-0.5">
              {favorites.length}
            </span>
          )}
        </Link>

        {/* Cart */}
        <button
          onClick={() => {
            setIsCartOpen(true)
            setSidebarOpen(false)
          }}
          className="w-full flex items-center gap-3 py-3 px-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          <span className="flex-1 text-left">{t("cart")}</span>
          {totalItems > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] rounded-full px-1.5 py-0.5">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Help links */}
      <div className="border-b border-border p-4">
        <Link 
          href={localizedPath("/help")}
          className="block py-2 text-sm text-muted-foreground hover:text-primary"
          onClick={() => setSidebarOpen(false)}
        >
          {t("help")}
        </Link>
        <Link 
          href={localizedPath("/track")}
          className="block py-2 text-sm text-muted-foreground hover:text-primary"
          onClick={() => setSidebarOpen(false)}
        >
          {t("trackOrder")}
        </Link>
      </div>

      {/* Categories */}
      <div className="overflow-y-auto p-4" style={{ maxHeight: "calc(100vh - 220px)" }}>
        <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">{t("categories") || "Categories"}</p>
        <div className="flex flex-col">
          {categories.map((category) => {
            if (category.id === "brands") {
              return (
                <div key={category.id} className="border-b border-border/50">
                  {/* Brands section header — expandable */}
                  <button
                    onClick={() => setExpandedBrandsSection(!expandedBrandsSection)}
                    className="w-full py-3 text-sm font-medium text-foreground transition-colors hover:text-primary flex items-center justify-between"
                  >
                    {getCategoryName(category.id)}
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform ${expandedBrandsSection ? "rotate-180" : ""}`} 
                    />
                  </button>
                  {/* Brands list — collapsible */}
                  {expandedBrandsSection && (
                    <div className="bg-secondary/30 py-2 px-2 rounded-lg mb-2">
                      {BRANDS_ORDERED.map((brand) => (
                        <Link
                          key={brand}
                          href={localizedPath(`/brand/${getBrandSlug(brand)}`)}
                          className="block py-2 pl-3 text-sm text-foreground/80 hover:text-primary transition-colors"
                          onClick={() => setSidebarOpen(false)}
                        >
                          {brand}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
            return (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="border-b border-border/50 py-3 text-sm font-medium text-foreground transition-colors hover:text-primary"
                onClick={() => setSidebarOpen(false)}
              >
                {getCategoryName(category.id)}
              </Link>
            )
          })}
          <Link 
            href={localizedPath("/specials")}
            className="border-b border-border/50 py-3 text-sm font-medium text-destructive"
            onClick={() => setSidebarOpen(false)}
          >
            {t("specials")}
          </Link>
          <Link 
            href={localizedPath("/popular")}
            className="py-3 text-sm font-medium text-primary"
            onClick={() => setSidebarOpen(false)}
          >
            {t("bestSellers")}
          </Link>
        </div>
      </div>
    </div>
    </>
  )
}
