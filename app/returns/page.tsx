import Link from "next/link"
import { LangProvider } from "@/lib/i18n"
import { CartProvider } from "@/components/cart-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { Button } from "@/components/ui/button"
import { 
  ChevronRight, RotateCcw, CheckCircle2, XCircle, 
  Clock, Package, MessageSquare 
} from "lucide-react"

export default function ReturnsPage() {
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
              <span className="font-medium text-foreground">Возврат и обмен</span>
            </div>
          </div>

          <main className="flex-1 py-12">
            <div className="mx-auto max-w-4xl px-4">
              <h1 className="text-3xl font-bold text-foreground">Возврат и обмен</h1>
              <p className="mt-4 text-muted-foreground">
                Мы хотим, чтобы вы были полностью довольны своей покупкой
              </p>

              {/* Guarantee banner */}
              <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <RotateCcw className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      14 дней на возврат
                    </h2>
                    <p className="text-muted-foreground">
                      Вы можете вернуть товар в течение 14 дней с момента получения
                    </p>
                  </div>
                </div>
              </div>

              {/* Conditions */}
              <section className="mt-12">
                <h2 className="text-xl font-semibold text-foreground">Условия возврата</h2>
                
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Можно вернуть</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Товар в оригинальной упаковке</li>
                      <li>• Неиспользованный товар</li>
                      <li>• Товар с сохраненными этикетками</li>
                      <li>• Товар с чеком или подтверждением заказа</li>
                      <li>• Товар ненадлежащего качества</li>
                    </ul>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-destructive" />
                      <h3 className="font-semibold text-foreground">Нельзя вернуть</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Открытую или использованную косметику</li>
                      <li>• Товары без упаковки</li>
                      <li>• Товары, купленные более 14 дней назад</li>
                      <li>• Товары со следами использования</li>
                      <li>• Товары, поврежденные покупателем</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How to return */}
              <section className="mt-12">
                <h2 className="text-xl font-semibold text-foreground">Как оформить возврат</h2>
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Свяжитесь с нами</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Напишите на email info@pharmiperia.com или заполните форму на странице контактов. 
                        Укажите номер заказа и причину возврата.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Получите подтверждение</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Мы рассмотрим вашу заявку в течение 24 часов и отправим инструкции по возврату.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Отправьте товар</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Упакуйте товар и отправьте его по указанному адресу. 
                        Стоимость обратной доставки зависит от причины возврата.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Получите возврат</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        После получения и проверки товара мы вернём деньги тем же способом, 
                        которым была произведена оплата, в течение 5-7 рабочих дней.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Refund info */}
              <section className="mt-12">
                <h2 className="text-xl font-semibold text-foreground">Информация о возврате средств</h2>
                <div className="mt-4 rounded-xl border border-border bg-card p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Срок возврата</p>
                        <p className="text-sm text-muted-foreground">5-7 рабочих дней</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Package className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Стоимость доставки</p>
                        <p className="text-sm text-muted-foreground">Возвращается при браке товара</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* CTA */}
              <div className="mt-12 rounded-xl border border-border bg-card p-6 text-center">
                <MessageSquare className="mx-auto h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">Остались вопросы?</h3>
                <p className="mt-2 text-muted-foreground">
                  Наша команда поддержки готова помочь вам
                </p>
                <Link href="/contact">
                  <Button className="mt-4">Связаться с нами</Button>
                </Link>
              </div>
            </div>
          </main>

          <SiteFooter />
        </div>
      </CartProvider>
    </LangProvider>
  )
}
