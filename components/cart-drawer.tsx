"use client"

import { useState } from "react"
import { useCart } from "@/components/cart-context"
import { useAuth } from "@/components/auth-provider"
import { useLang, formatMoney } from "@/lib/i18n"
import { multiplyMoney } from "@/lib/money"
import { Button } from "@/components/ui/button"
import { X, Plus, Minus, ShoppingBag, LogIn, UserPlus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function CartDrawer() {
  const { items, removeFromCart, updateQuantity, totalMoney, isCartOpen, setIsCartOpen } = useCart()
  const { user } = useAuth()
  const { t, localizedPath } = useLang()
  const [showAuthModal, setShowAuthModal] = useState(false)

  if (!isCartOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-card-foreground">
            {t("shoppingCart")}
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-muted-foreground">
            <ShoppingBag className="h-16 w-16 opacity-30" />
            <p className="text-lg">{t("cartEmpty")}</p>
            <Button variant="outline" onClick={() => setIsCartOpen(false)}>
              {t("continueShopping")}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 rounded-lg border border-border bg-background p-3"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="text-xs text-muted-foreground">
                        {item.product.brand}
                      </p>
                      <p className="line-clamp-2 text-sm font-medium text-card-foreground">
                        {item.product.name}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-[1.5rem] text-center text-sm font-medium text-card-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-primary">
                            {formatMoney(multiplyMoney(item.product.price, item.quantity))}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-muted-foreground transition-colors hover:text-destructive"
                            aria-label="Remove item"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border px-6 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-base font-semibold text-card-foreground">{t("total")}</span>
                <span className="text-xl font-bold text-primary">
                  {formatMoney(totalMoney)}
                </span>
              </div>
              {!!user ? (
                <Link href={localizedPath("/checkout")} className="block">
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    size="lg"
                    onClick={() => setIsCartOpen(false)}
                  >
                    {t("checkout")}
                  </Button>
                </Link>
              ) : (
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                  onClick={() => setShowAuthModal(true)}
                >
                  {t("checkout")}
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full mt-3 border border-border bg-transparent hover:bg-muted text-foreground"
                size="lg"
                onClick={() => setIsCartOpen(false)}
              >
                {t("continueShopping")}
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                {t("freeShippingCart")}
              </p>
            </div>
          </>
        )}
      </div>
      {/* Auth required modal */}
      {showAuthModal && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm"
            onClick={() => setShowAuthModal(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-[70] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {t("cartLoginTitle")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("cartLoginDesc")}
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Link
                href={localizedPath("/auth/login")}
                onClick={() => { setShowAuthModal(false); setIsCartOpen(false) }}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <LogIn className="h-4 w-4" />
                {t("cartLoginButton")}
              </Link>
              <Link
                href={localizedPath("/auth/sign-up")}
                onClick={() => { setShowAuthModal(false); setIsCartOpen(false) }}
                className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <UserPlus className="h-4 w-4" />
                {t("cartSignupButton")}
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  )
}
