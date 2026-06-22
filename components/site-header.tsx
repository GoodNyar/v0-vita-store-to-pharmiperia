"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useCart } from "@/components/cart-context"
import { useAuth } from "@/components/auth-provider"
import { useLang, type TranslationKey } from "@/lib/i18n"
import { useFavorites } from "@/components/favorites-provider"
import { categories, BRANDS_ORDERED, promoBarItems } from "@/lib/data"
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  ChevronDown,
  Leaf,
  X,
  Truck,
  BadgeCheck,
  Sparkles,
} from "lucide-react"

const promoIconMap = {
  Truck,
  BadgeCheck,
  Sparkles,
}

const isBrandName = (sub: string) => BRANDS_ORDERED.includes(sub)

const getBrandSlug = (brand: string): string => {
  return brand
    .toLowerCase()
    .replace(/[èéêë]/g, "e")
    .replace(/[âäà]/g, "a")
    .replace(/[ôöò]/g, "o")
    .replace(/[ûüù]/g, "u")
    .replace(/[ïî]/g, "i")
    .replace(/[ç]/g, "c")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const { totalItems, setIsCartOpen } = useCart()
  const { user, isLoading: authLoading } = useAuth()
  const { favorites } = useFavorites()
  const { lang, setLang, t } = useLang()
  const [searchValue, setSearchValue] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [promoVisible, setPromoVisible] = useState(true)
  const [promoIndex, setPromoIndex] = useState(0)
  const promoItems = promoBarItems[lang]

  useEffect(() => { setPromoIndex(0) }, [lang])
  useEffect(() => {
    if (!promoVisible) return
    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promoItems.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [promoItems, promoVisible])

  const currentPromo = promoItems[promoIndex]
  const PromoIcon = promoIconMap[currentPromo?.icon as keyof typeof promoIconMap]

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
            <Link href="/help" className="transition-colors hover:text-primary">
              {t("help")}
            </Link>
            <Link href="/track" className="transition-colors hover:text-primary">
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
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 flex-shrink-0">
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
                  window.location.href = `/search?q=${encodeURIComponent(searchValue.trim())}`
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
              href={user ? "/account" : "/auth/login"}
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
              href="/account/favorites"
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
                window.location.href = `/search?q=${encodeURIComponent(searchValue.trim())}`
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
      <nav className="hidden border-t border-border lg:block">
        <div>
          <div className="mx-auto max-w-7xl px-4">
            <ul className="flex items-center justify-center gap-0">
            {categories.map((category) => (
              <li
                key={category.id}
                className="relative"
                onMouseEnter={() => setActiveDropdown(category.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {/* All categories: regular link with dropdown on hover */}
                <Link 
                  href={`/category/${category.id}`}
                  className="flex items-center gap-1 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  {getCategoryName(category.id)}
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>

                {activeDropdown === category.id && category.subcategories && category.subcategories.length > 0 && (
                  <div className="absolute left-0 top-full z-50 min-w-[200px] rounded-lg border border-border bg-card py-2 shadow-lg">
                    {category.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          href={`/category/${category.id}?filter=${sub}`}
                          className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
                        >
                          {t(sub as TranslationKey)}
                        </Link>
                      ))}
                  </div>
                )}
              </li>
            ))}
            <li>
              <Link href="/specials">
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
              <Link href="/popular">
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
      className={`fixed top-0 left-0 z-50 h-full w-72 bg-card shadow-xl transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <Link href="/" className="flex items-center gap-1.5" onClick={() => setSidebarOpen(false)}>
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
          href="/account/favorites"
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
          href="/help" 
          className="block py-2 text-sm text-muted-foreground hover:text-primary"
          onClick={() => setSidebarOpen(false)}
        >
          {t("help")}
        </Link>
        <Link 
          href="/track" 
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
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="border-b border-border/50 py-3 text-sm font-medium text-foreground transition-colors hover:text-primary"
              onClick={() => setSidebarOpen(false)}
            >
              {getCategoryName(category.id)}
            </Link>
          ))}
          <Link 
            href="/specials" 
            className="border-b border-border/50 py-3 text-sm font-medium text-destructive"
            onClick={() => setSidebarOpen(false)}
          >
            {t("specials")}
          </Link>
          <Link 
            href="/popular" 
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
