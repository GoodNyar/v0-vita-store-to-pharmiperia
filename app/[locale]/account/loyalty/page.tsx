"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { CartDrawer } from "@/components/cart-drawer"
import { SiteFooter } from "@/components/site-footer"
import { LangProvider, useLang } from "@/lib/i18n"
import { createClient } from "@/lib/supabase/client"
import { 
  Award, 
  Gift, 
  Star, 
  TrendingUp, 
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Clock
} from "lucide-react"

interface LoyaltyPoints {
  balance: number
  total_earned: number
  total_spent: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

interface LoyaltyTransaction {
  id: string
  points: number
  type: 'earn' | 'spend' | 'bonus' | 'expire'
  description: string
  created_at: string
}

const tierConfig = {
  bronze: { 
    name: 'Bronze', 
    nameRu: 'Бронза',
    color: 'from-amber-600 to-amber-700', 
    textColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
    minPoints: 0,
    discount: 3,
    nextTier: 'silver',
    nextTierPoints: 500
  },
  silver: { 
    name: 'Silver', 
    nameRu: 'Серебро',
    color: 'from-gray-400 to-gray-500', 
    textColor: 'text-gray-500',
    bgColor: 'bg-gray-50',
    minPoints: 500,
    discount: 5,
    nextTier: 'gold',
    nextTierPoints: 1500
  },
  gold: { 
    name: 'Gold', 
    nameRu: 'Золото',
    color: 'from-yellow-400 to-yellow-500', 
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    minPoints: 1500,
    discount: 7,
    nextTier: 'platinum',
    nextTierPoints: 5000
  },
  platinum: { 
    name: 'Platinum', 
    nameRu: 'Платина',
    color: 'from-slate-700 to-slate-800', 
    textColor: 'text-slate-700',
    bgColor: 'bg-slate-50',
    minPoints: 5000,
    discount: 10,
    nextTier: null,
    nextTierPoints: null
  }
}

function LoyaltyContent() {
  const { t, lang } = useLang()
  const [loyalty, setLoyalty] = useState<LoyaltyPoints | null>(null)
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)

  useEffect(() => {
    async function loadLoyaltyData() {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (!user) {
        setLoading(false)
        return
      }

      // Load loyalty points
      const { data: loyaltyData } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (loyaltyData) {
        setLoyalty(loyaltyData)
      }

      // Load transactions
      const { data: transactionsData } = await supabase
        .from('loyalty_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (transactionsData) {
        setTransactions(transactionsData)
      }

      setLoading(false)
    }

    loadLoyaltyData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <Award className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-6 text-2xl font-bold">Программа лояльности</h1>
        <p className="mt-2 text-muted-foreground">
          Войдите в аккаунт, чтобы видеть свои бонусные баллы
        </p>
        <Link
          href="/auth/login"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Войти
        </Link>
      </div>
    )
  }

  const currentTier = loyalty?.tier || 'bronze'
  const tier = tierConfig[currentTier]
  const progress = tier.nextTierPoints 
    ? Math.min(100, ((loyalty?.total_earned || 0) - tier.minPoints) / (tier.nextTierPoints - tier.minPoints) * 100)
    : 100

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Программа лояльности</h1>
        <p className="mt-1 text-muted-foreground">
          Зарабатывайте баллы с каждой покупкой
        </p>
      </div>

      {/* Main Card */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${tier.color} p-6 text-white shadow-xl`}>
        <div className="absolute right-0 top-0 opacity-10">
          <Sparkles className="h-48 w-48" />
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6" />
            <span className="text-sm font-medium opacity-90">Уровень {tier.nameRu}</span>
          </div>
          
          <div className="mt-4">
            <div className="text-5xl font-bold">{loyalty?.balance || 0}</div>
            <div className="mt-1 text-sm opacity-80">доступных баллов</div>
          </div>

          <div className="mt-6 flex items-center gap-6 text-sm">
            <div>
              <div className="opacity-70">Всего заработано</div>
              <div className="font-semibold">{loyalty?.total_earned || 0} баллов</div>
            </div>
            <div>
              <div className="opacity-70">Потрачено</div>
              <div className="font-semibold">{loyalty?.total_spent || 0} баллов</div>
            </div>
            <div>
              <div className="opacity-70">Скидка</div>
              <div className="font-semibold">{tier.discount}%</div>
            </div>
          </div>

          {tier.nextTier && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-70">До уровня {tierConfig[tier.nextTier as keyof typeof tierConfig].nameRu}</span>
                <span className="font-semibold">{tier.nextTierPoints! - (loyalty?.total_earned || 0)} баллов</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/30">
                <div 
                  className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Benefits */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className={`rounded-xl ${tier.bgColor} p-4`}>
          <Gift className={`h-8 w-8 ${tier.textColor}`} />
          <h3 className="mt-3 font-semibold">1 EUR = 1 балл</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            За каждый евро покупки вы получаете 1 бонусный балл
          </p>
        </div>
        
        <div className={`rounded-xl ${tier.bgColor} p-4`}>
          <Star className={`h-8 w-8 ${tier.textColor}`} />
          <h3 className="mt-3 font-semibold">{tier.discount}% скидка</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Ваша персональная скидка на весь ассортимент
          </p>
        </div>
        
        <div className={`rounded-xl ${tier.bgColor} p-4`}>
          <TrendingUp className={`h-8 w-8 ${tier.textColor}`} />
          <h3 className="mt-3 font-semibold">Рост уровня</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Больше покупок — выше уровень и больше привилегий
          </p>
        </div>
      </div>

      {/* Tier Levels */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Уровни программы</h2>
        <div className="mt-4 space-y-3">
          {Object.entries(tierConfig).map(([key, config]) => (
            <div 
              key={key}
              className={`flex items-center justify-between rounded-lg border p-4 ${
                currentTier === key ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">{config.nameRu}</div>
                  <div className="text-sm text-muted-foreground">
                    {config.minPoints === 0 ? 'Начальный' : `От ${config.minPoints} баллов`}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-primary">{config.discount}%</div>
                <div className="text-sm text-muted-foreground">скидка</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">История операций</h2>
        
        {transactions.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-border p-8 text-center">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">История операций пуста</p>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    tx.type === 'earn' || tx.type === 'bonus' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {tx.type === 'earn' ? (
                      <ShoppingBag className="h-5 w-5 text-green-600" />
                    ) : tx.type === 'bonus' ? (
                      <Gift className="h-5 w-5 text-green-600" />
                    ) : (
                      <Star className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{tx.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                <div className={`font-semibold ${
                  tx.type === 'earn' || tx.type === 'bonus' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {tx.type === 'earn' || tx.type === 'bonus' ? '+' : '-'}{Math.abs(tx.points)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back to Account */}
      <div className="mt-8">
        <Link 
          href="/account"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          Вернуться в личный кабинет
        </Link>
      </div>
    </div>
  )
}

export default function LoyaltyPage() {
  return (
    <LangProvider>
        <div className="min-h-screen bg-background">
          <SiteHeader />
          <CartDrawer />
          <main>
            <LoyaltyContent />
          </main>
          <SiteFooter />
        </div>
    </LangProvider>
  )
}
