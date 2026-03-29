"use client"

import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PromoBar } from "@/components/promo-bar"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider } from "@/components/cart-context"
import { LangProvider } from "@/lib/i18n"
import { Gift, TrendingUp, Users, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function PartnersPage() {
  const [form, setForm] = useState({ name: "", email: "", website: "", audience: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <LangProvider>
      <CartProvider>
        <PromoBar />
        <SiteHeader />
        <CartDrawer />
        <main className="min-h-screen bg-background">
          {/* Hero */}
          <div className="bg-primary/5 border-b border-border py-14">
            <div className="mx-auto max-w-3xl px-4 text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">Партнёрская программа</span>
              <h1 className="mt-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
                Зарабатывайте с Pharmiperia
              </h1>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Рекомендуйте аптечную косметику своей аудитории и получайте комиссию с каждой продажи. Подходит для блогеров, beauty-экспертов и всех, кто говорит о красоте и уходе за кожей.
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-5xl px-4 py-12">
            {/* Benefits */}
            <div className="grid gap-6 sm:grid-cols-3 mb-14">
              {[
                { icon: TrendingUp, title: "До 12% комиссии", desc: "С каждой продажи по вашей реферальной ссылке. Чем больше продаж — тем выше ставка." },
                { icon: Gift, title: "30 дней cookie", desc: "Покупатель может вернуться через месяц — вы всё равно получите комиссию." },
                { icon: Users, title: "Любая аудитория", desc: "Блог, Instagram, YouTube, TikTok или личные рекомендации — всё работает." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-xl border border-border bg-card p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div className="mb-14">
              <h2 className="mb-6 text-xl font-bold text-foreground">Как это работает</h2>
              <div className="space-y-4">
                {[
                  { step: "1", text: "Заполните заявку — мы рассмотрим её в течение 2 рабочих дней." },
                  { step: "2", text: "Получите уникальную реферальную ссылку и промокод для вашей аудитории." },
                  { step: "3", text: "Делитесь ссылкой в блоге, социальных сетях или мессенджерах." },
                  { step: "4", text: "Получайте выплаты ежемесячно на банковский счёт или PayPal." },
                ].map(({ step, text }) => (
                  <div key={step} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{step}</div>
                    <p className="text-sm text-foreground leading-relaxed pt-1">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-14 rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-bold text-foreground">Требования к партнёрам</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  "Аудитория от 500 человек (в любом канале)",
                  "Контент о красоте, здоровье или уходе за собой",
                  "Активность — минимум 2 поста в месяц",
                  "Честные рекомендации без накрутки",
                ].map((req) => (
                  <div key={req} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    {req}
                  </div>
                ))}
              </div>
            </div>

            {/* Application Form */}
            <div className="rounded-2xl border border-border bg-card p-8">
              <h2 className="mb-6 text-xl font-bold text-foreground">Подать заявку</h2>
              {submitted ? (
                <div className="py-10 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-primary" />
                  <h3 className="mt-4 text-lg font-bold text-foreground">Заявка отправлена!</h3>
                  <p className="mt-2 text-muted-foreground">Мы свяжемся с вами в течение 2 рабочих дней.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Ваше имя *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
                        placeholder="Имя Фамилия"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Email *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Ссылка на ваш блог / канал *</label>
                    <input
                      type="url"
                      required
                      value={form.website}
                      onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                      className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
                      placeholder="https://instagram.com/yourprofile"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Размер аудитории</label>
                    <select
                      value={form.audience}
                      onChange={e => setForm(f => ({ ...f, audience: e.target.value }))}
                      className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
                    >
                      <option value="">Выберите...</option>
                      <option>500 — 2 000</option>
                      <option>2 000 — 10 000</option>
                      <option>10 000 — 50 000</option>
                      <option>50 000+</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Расскажите о себе</label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none"
                      placeholder="О чём ваш контент, почему хотите сотрудничать с Pharmiperia..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Отправить заявку
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>
        <SiteFooter />
      </CartProvider>
    </LangProvider>
  )
}
