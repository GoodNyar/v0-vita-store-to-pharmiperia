import Link from "next/link"
import Image from "next/image"
import { LangProvider } from "@/lib/i18n"
import { CartProvider } from "@/components/cart-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { 
  ChevronRight, Shield, Truck, Award, Heart, 
  Globe, Leaf, Users, CheckCircle2 
} from "lucide-react"

export default function AboutPage() {
  return (
    <LangProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col bg-background">
          <SiteHeader />
          <CartDrawer />

          {/* Breadcrumbs */}
          <div className="border-b border-border bg-card">
            <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-primary">
                Главная
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">О нас</span>
            </div>
          </div>

          <main className="flex-1">
            {/* Hero */}
            <section className="bg-primary/5 py-16">
              <div className="mx-auto max-w-7xl px-4 text-center">
                <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                  Pharmiperia — аутентичная французская аптечная косметика
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                  Мы доставляем оригинальную дерматологическую косметику напрямую из Европы, 
                  чтобы вы могли наслаждаться лучшим уходом за кожей по доступным ценам.
                </p>
              </div>
            </section>

            {/* Mission */}
            <section className="py-16">
              <div className="mx-auto max-w-7xl px-4">
                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                      Наша миссия
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                      Мы верим, что качественный уход за кожей должен быть доступен каждому. 
                      Наша команда тщательно отбирает продукты от ведущих европейских дерматологических 
                      брендов и доставляет их напрямую к вашей двери.
                    </p>
                    <p className="mt-4 text-muted-foreground">
                      Каждый продукт в нашем ассортименте прошёл строгий контроль качества 
                      и соответствует европейским стандартам безопасности косметической продукции.
                    </p>
                    <div className="mt-8 grid grid-cols-2 gap-6">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">100%</p>
                          <p className="text-sm text-muted-foreground">Оригинальная продукция</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">50 000+</p>
                          <p className="text-sm text-muted-foreground">Довольных клиентов</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">15+</p>
                          <p className="text-sm text-muted-foreground">Стран доставки</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Leaf className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">8+</p>
                          <p className="text-sm text-muted-foreground">Премиум брендов</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
                    <Image
                      src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800"
                      alt="Аптечная косметика"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Values */}
            <section className="bg-card py-16">
              <div className="mx-auto max-w-7xl px-4">
                <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
                  Наши ценности
                </h2>
                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Shield className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">Гарантия качества</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Только оригинальная продукция с сертификатами от официальных дистрибьюторов
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Truck className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">Быстрая доставка</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Доставка по всей Латвии за 2-5 рабочих дней, бесплатно при заказе от 50 EUR
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Award className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">Лучшие бренды</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      La Roche-Posay, Vichy, Bioderma, Avène, CeraVe и другие топовые бренды
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Heart className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">Забота о клиентах</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Персональные консультации и помощь в подборе средств для вашего типа кожи
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Brands */}
            <section className="py-16">
              <div className="mx-auto max-w-7xl px-4">
                <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
                  Наши бренды
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
                  Мы работаем только с проверенными европейскими брендами аптечной косметики
                </p>
                <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
                  {["La Roche-Posay", "Vichy", "Bioderma", "Avène", "CeraVe", "Eucerin", "Nuxe", "SVR"].map(brand => (
                    <div 
                      key={brand} 
                      className="flex h-24 items-center justify-center rounded-xl border border-border bg-card p-4"
                    >
                      <span className="text-lg font-semibold text-muted-foreground">{brand}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>

          <SiteFooter />
        </div>
      </CartProvider>
    </LangProvider>
  )
}
