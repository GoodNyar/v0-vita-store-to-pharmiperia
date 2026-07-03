"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { LangProvider, useLang } from "@/lib/i18n"
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react"

type Lang = "ru" | "lv"
type Loc = Record<Lang, string>

const articles: Record<string, {
  title: Loc
  category: Loc
  date: Loc
  readTime: Loc
  image: string
  content: { ru: string[]; lv: string[] }
}> = {
  "top-spf-produkty-2026": {
    title: {
      ru: "Лучшие SPF-средства 2026: что выбрать этим летом",
      lv: "Labākie SPF līdzekļi 2026: ko izvēlēties šovasar",
    },
    category: { ru: "Солнцезащита", lv: "Saules aizsardzība" },
    date: { ru: "25 марта 2026", lv: "2026. gada 25. marts" },
    readTime: { ru: "5 мин", lv: "5 min" },
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&q=80",
    content: {
      ru: [
        "Солнцезащита — это не сезонный ритуал, а ежедневная необходимость. Ультрафиолетовые лучи воздействуют на кожу круглый год, даже в пасмурные дни и в помещении у окна. Дерматологи рекомендуют использовать SPF не менее 30 ежедневно, а в летний период — SPF 50+.",
        "Главный вопрос: как выбрать средство, которое защищает, но не оставляет белых разводов и не делает кожу жирной? Мы отобрали лучшие варианты, протестированные нашей командой.",
        "Anthelios UV Mune 400 SPF50+ от La Roche-Posay — абсолютный фаворит. Инновационная формула с фильтром Mexoryl 400 защищает от UVA-лучей с самой длинной волной, которые проникают глубже всего. Флюидная текстура не оставляет следов, подходит для чувствительной кожи.",
        "Для тех, кто ищет вариант с уходовым эффектом, рекомендуем Mineral 89 от Vichy с добавлением гиалуроновой кислоты. Он одновременно увлажняет и защищает, что делает его идеальным для ежедневного использования.",
        "Thermal Spring Water Spray от Avène — отличный выбор для обновления защиты в течение дня поверх макияжа. Лёгкий спрей мгновенно освежает и восстанавливает SPF-слой.",
        "Важно помнить: никакое SPF-средство не защищает на 100%. Используйте его вместе с другими методами защиты — шляпой, очками и нахождением в тени в пиковые часы с 11 до 15.",
      ],
      lv: [
        "Saules aizsardzība nav sezonāls rituāls, bet ikdienas nepieciešamība. Ultravioletie stari iedarbojas uz ādu visu gadu, pat mākoņainās dienās un telpās pie loga. Dermatologi iesaka ikdienā lietot SPF vismaz 30, bet vasaras periodā — SPF 50+.",
        "Galvenais jautājums: kā izvēlēties līdzekli, kas aizsargā, bet neatstāj baltas svītras un nepadara ādu taukainu? Mēs atlasījām labākos variantus, kurus pārbaudīja mūsu komanda.",
        "Anthelios UV Mune 400 SPF50+ no La Roche-Posay ir absolūts favorīts. Inovatīvā formula ar Mexoryl 400 filtru aizsargā no garākā viļņa UVA stariem, kas iekļūst visdziļāk. Fluīda tekstūra neatstāj pēdas un ir piemērota jutīgai ādai.",
        "Tiem, kas meklē variantu ar kopšanas efektu, iesakām Mineral 89 no Vichy ar hialuronskābes piedevu. Tas vienlaikus mitrina un aizsargā, kas padara to ideālu ikdienas lietošanai.",
        "Thermal Spring Water Spray no Avène ir lieliska izvēle aizsardzības atjaunošanai dienas laikā virs grima. Vieglais aerosols uzreiz atsvaidzina un atjauno SPF slāni.",
        "Svarīgi atcerēties: neviens SPF līdzeklis neaizsargā 100%. Izmantojiet to kopā ar citām aizsardzības metodēm — cepuri, brillēm un uzturēšanos ēnā maksimuma stundās no 11 līdz 15.",
      ],
    },
  },
  "gialuronovaya-kislota-kak-vybrat": {
    title: {
      ru: "Гиалуроновая кислота: как выбрать правильную концентрацию",
      lv: "Hialuronskābe: kā izvēlēties pareizo koncentrāciju",
    },
    category: { ru: "Уход за лицом", lv: "Sejas kopšana" },
    date: { ru: "18 марта 2026", lv: "2026. gada 18. marts" },
    readTime: { ru: "7 мин", lv: "7 min" },
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&q=80",
    content: {
      ru: [
        "Гиалуроновая кислота — один из самых популярных ингредиентов в косметике, но мало кто знает, что она существует в разных молекулярных весах, и каждый из них работает по-своему.",
        "Высокомолекулярная HA (>1000 кДа) остаётся на поверхности кожи и создаёт защитный барьер, удерживая влагу. Она идеальна для тех, у кого склонность к сухости и шелушению.",
        "Низкомолекулярная HA (<500 кДа) проникает в более глубокие слои эпидермиса, стимулируя выработку собственной гиалуроновой кислоты. Именно она даёт долгосрочный эффект плотности и упругости кожи.",
        "Лучшие продукты содержат оба типа молекул. Mineral 89 от Vichy использует фирменную технологию Hyalu-5 с пятью формами гиалуроновой кислоты — это обеспечивает комплексное увлажнение на всех уровнях кожи.",
        "Hyalu B5 от La Roche-Posay сочетает гиалуроновую кислоту с провитамином B5, который дополнительно восстанавливает кожный барьер. Это особенно важно после агрессивных процедур — пилингов, лазера или ретинола.",
        "Наносить сыворотку с гиалуроновой кислотой нужно на влажную кожу — это помогает молекулам HA удерживать воду. После нанесения обязательно используйте крем-финишер, чтобы запечатать влагу.",
      ],
      lv: [
        "Hialuronskābe ir viena no populārākajām sastāvdaļām kosmētikā, taču maz kurš zina, ka tā pastāv dažādās molekulmasās, un katra no tām darbojas savā veidā.",
        "Augstas molekulmasas HA (>1000 kDa) paliek uz ādas virsmas un veido aizsargbarjeru, noturot mitrumu. Tā ir ideāla tiem, kam ir nosliece uz sausumu un lobīšanos.",
        "Zemas molekulmasas HA (<500 kDa) iekļūst dziļākajos epidermas slāņos, stimulējot pašas ādas hialuronskābes ražošanu. Tieši tā dod ilgtermiņa blīvuma un elastības efektu.",
        "Labākie produkti satur abus molekulu veidus. Mineral 89 no Vichy izmanto firmas tehnoloģiju Hyalu-5 ar piecām hialuronskābes formām — tas nodrošina kompleksu mitrināšanu visos ādas līmeņos.",
        "Hyalu B5 no La Roche-Posay apvieno hialuronskābi ar provitamīnu B5, kas papildus atjauno ādas barjeru. Tas ir īpaši svarīgi pēc agresīvām procedūrām — pīlingiem, lāzera vai retinola.",
        "Serums ar hialuronskābi jāuzklāj uz mitras ādas — tas palīdz HA molekulām noturēt ūdeni. Pēc uzklāšanas noteikti izmantojiet krēmu-noslēdzēju, lai noslēgtu mitrumu.",
      ],
    },
  },
  "sensitiv-kozha-rukovodstvo": {
    title: {
      ru: "Чувствительная кожа: полный гид по уходу",
      lv: "Jutīga āda: pilns kopšanas ceļvedis",
    },
    category: { ru: "Чувствительная кожа", lv: "Jutīga āda" },
    date: { ru: "10 марта 2026", lv: "2026. gada 10. marts" },
    readTime: { ru: "9 мин", lv: "9 min" },
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=1200&q=80",
    content: {
      ru: [
        "Чувствительная кожа реагирует на многие раздражители — косметику, воду, температуру, стресс. Она краснеет, зудит, шелушится и стягивается там, где здоровая кожа не реагирует вовсе.",
        "Ключевое правило: меньше значит больше. Многоступенчатые рутины с 10+ продуктами — верный путь к раздражению. Выберите очищение, увлажнение и защиту — и этого достаточно.",
        "Для очищения выбирайте мицеллярную воду без спирта и отдушек. Sensibio H2O от Bioderma — эталон в этой категории: она создана специально для гиперреактивной кожи и снимает макияж без агрессивного трения.",
        "Cicaplast Baume B5+ от La Roche-Posay — универсальный продукт для чувствительной кожи. Он успокаивает раздражение, восстанавливает барьер и может применяться как база под макияж, маска на ночь или средство первой помощи при обострениях.",
        "Избегайте продуктов с эфирными маслами, отдушками, высоким содержанием спирта и кислотами в высокой концентрации. Перед введением нового продукта делайте тест на запястье в течение 48 часов.",
        "Термальная вода Avène — отличный успокаивающий спрей для использования в течение дня. Её противовоспалительные и успокаивающие свойства клинически подтверждены.",
      ],
      lv: [
        "Jutīga āda reaģē uz daudziem kairinātājiem — kosmētiku, ūdeni, temperatūru, stresu. Tā kļūst sarkana, niez, lobās un saraujas tur, kur vesela āda nereaģē nemaz.",
        "Galvenais noteikums: mazāk nozīmē vairāk. Daudzpakāpju rutīnas ar 10+ produktiem ir drošs ceļš uz kairinājumu. Izvēlieties attīrīšanu, mitrināšanu un aizsardzību — un ar to pietiek.",
        "Attīrīšanai izvēlieties micelāro ūdeni bez spirta un aromāta. Sensibio H2O no Bioderma ir etalons šajā kategorijā: tas ir radīts speciāli hiperreaktīvai ādai un noņem grimu bez agresīvas berzes.",
        "Cicaplast Baume B5+ no La Roche-Posay ir universāls produkts jutīgai ādai. Tas nomierina kairinājumu, atjauno barjeru un to var lietot kā grima bāzi, nakts masku vai pirmās palīdzības līdzekli paasinājumu laikā.",
        "Izvairieties no produktiem ar ēteriskajām eļļām, aromātiem, augstu spirta saturu un skābēm augstā koncentrācijā. Pirms jauna produkta ieviešanas veiciet testu uz plaukstas locītavas 48 stundu laikā.",
        "Avène termālais ūdens ir lielisks nomierinošs aerosols lietošanai dienas laikā. Tā pretiekaisuma un nomierinošās īpašības ir klīniski apstiprinātas.",
      ],
    },
  },
  "retinol-nachinaeushim": {
    title: {
      ru: "Ретинол для начинающих: как ввести в уход без раздражения",
      lv: "Retinols iesācējiem: kā ieviest kopšanā bez kairinājuma",
    },
    category: { ru: "Антивозрастной уход", lv: "Pretnovecošanās kopšana" },
    date: { ru: "3 марта 2026", lv: "2026. gada 3. marts" },
    readTime: { ru: "8 мин", lv: "8 min" },
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=1200&q=80",
    content: {
      ru: [
        "Ретинол — производное витамина А — один из немногих ингредиентов с доказанной эффективностью в борьбе со старением кожи. Он ускоряет клеточное обновление, стимулирует выработку коллагена и выравнивает тон кожи.",
        "Но у ретинола есть репутация «агрессивного» ингредиента. Шелушение, покраснение и сухость в первые недели — нормальная реакция. Это называется «ретинол-пурж» и обычно проходит через 4-6 недель.",
        "Начинайте с концентрации 0,025–0,05% и используйте продукт 1-2 раза в неделю. Постепенно увеличивайте частоту до ежедневного применения по мере адаптации кожи.",
        "Наносите ретинол только на ночь — он разрушается под воздействием солнечного света. Утром обязательно используйте SPF 50+, иначе весь эффект сводится к нулю, а кожа становится более уязвимой к фотостарению.",
        "Не сочетайте ретинол с кислотами (AHA/BHA), витамином С и бензоилпероксидом в одной рутине — это усиливает раздражение. Чередуйте использование.",
        "После нанесения ретинола используйте насыщенный увлажняющий крем. Cicaplast Baume B5+ или Hyalu B5 от La Roche-Posay отлично справятся с восстановлением барьера кожи.",
      ],
      lv: [
        "Retinols — A vitamīna atvasinājums — ir viena no nedaudzajām sastāvdaļām ar pierādītu efektivitāti cīņā pret ādas novecošanos. Tas paātrina šūnu atjaunošanos, stimulē kolagēna ražošanu un izlīdzina ādas toni.",
        "Bet retinolam ir «agresīvas» sastāvdaļas reputācija. Lobīšanās, apsārtums un sausums pirmajās nedēļās ir normāla reakcija. To sauc par «retinola purgu», un tas parasti pāriet pēc 4-6 nedēļām.",
        "Sāciet ar koncentrāciju 0,025–0,05% un lietojiet produktu 1-2 reizes nedēļā. Pakāpeniski palieliniet biežumu līdz ikdienas lietošanai, ādai pielāgojoties.",
        "Uzklājiet retinolu tikai naktī — tas sadalās saules gaismas ietekmē. No rīta noteikti izmantojiet SPF 50+, citādi viss efekts tiek noreducēts uz nulli, un āda kļūst neaizsargātāka pret fotonovecošanos.",
        "Nekombinējiet retinolu ar skābēm (AHA/BHA), C vitamīnu un benzoilperoksīdu vienā rutīnā — tas pastiprina kairinājumu. Lietojiet pārmaiņus.",
        "Pēc retinola uzklāšanas izmantojiet bagātīgu mitrinošu krēmu. Cicaplast Baume B5+ vai Hyalu B5 no La Roche-Posay lieliski tiks galā ar ādas barjeras atjaunošanu.",
      ],
    },
  },
  "micellyarnaya-voda-mify": {
    title: {
      ru: "5 мифов о мицеллярной воде — разбираем с дерматологом",
      lv: "5 mīti par micelāro ūdeni — apskatām ar dermatologu",
    },
    category: { ru: "Очищение", lv: "Attīrīšana" },
    date: { ru: "24 февраля 2026", lv: "2026. gada 24. februāris" },
    readTime: { ru: "4 мин", lv: "4 min" },
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=1200&q=80",
    content: {
      ru: [
        "Миф 1: Мицеллярную воду не нужно смывать. Это зависит от формулы. Большинство лёгких мицеллярных вод, таких как Sensibio H2O, можно не смывать. Но если у вас очень чувствительная кожа или вы наносили плотный макияж — лучше умыться водой.",
        "Миф 2: Мицеллярная вода подходит только для нормальной кожи. Неправда. Существуют версии для жирной (с салициловой кислотой), сухой (с глицерином и церамидами) и чувствительной кожи. Главное — выбрать правильный вариант.",
        "Миф 3: Мицеллярная вода полностью заменяет очищение. Нет. Она отлично справляется с лёгким макияжем и загрязнениями, но стойкий водостойкий макияж требует масляного очищения или специального ремувера.",
        "Миф 4: Чем больше ватных дисков использовать — тем лучше очищение. Интенсивное трение травмирует кожу. Используйте один-два диска и мягкими движениями, без давления.",
        "Миф 5: Дорогие мицеллярные воды не эффективнее дешёвых. Цена часто отражает качество ингредиентов и клинические исследования. Sensibio H2O прошла дерматологические тесты — это не маркетинг, а реальные исследования.",
      ],
      lv: [
        "1. mīts: Micelārais ūdens nav jānoskalo. Tas atkarīgs no formulas. Lielāko daļu vieglo micelāro ūdeņu, piemēram, Sensibio H2O, var nenoskalot. Bet ja jums ir ļoti jutīga āda vai uzklājāt blīvu grimu — labāk nomazgāties ar ūdeni.",
        "2. mīts: Micelārais ūdens der tikai normālai ādai. Nepatiesi. Pastāv versijas taukainai (ar salicilskābi), sausai (ar glicerīnu un keramīdiem) un jutīgai ādai. Galvenais — izvēlēties pareizo variantu.",
        "3. mīts: Micelārais ūdens pilnībā aizstāj attīrīšanu. Nē. Tas lieliski tiek galā ar vieglu grimu un netīrumiem, bet noturīgs ūdensizturīgs grims prasa eļļas attīrīšanu vai īpašu noņēmēju.",
        "4. mīts: Jo vairāk vates disku izmantot — jo labāka attīrīšana. Intensīva berze traumē ādu. Izmantojiet vienu vai divus diskus un maigām kustībām, bez spiediena.",
        "5. mīts: Dārgie micelārie ūdeņi nav efektīvāki par lētajiem. Cena bieži atspoguļo sastāvdaļu kvalitāti un klīniskos pētījumus. Sensibio H2O izgāja dermatoloģiskus testus — tas nav mārketings, bet reāli pētījumi.",
      ],
    },
  },
  "uhod-za-volosami-zima": {
    title: {
      ru: "Зимний уход за волосами: спасаем от сухости и ломкости",
      lv: "Matu kopšana ziemā: glābjam no sausuma un trausluma",
    },
    category: { ru: "Волосы", lv: "Mati" },
    date: { ru: "15 февраля 2026", lv: "2026. gada 15. februāris" },
    readTime: { ru: "6 мин", lv: "6 min" },
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80",
    content: {
      ru: [
        "Зима — испытание для волос. Холодный воздух снаружи и горячий сухой воздух от батарей внутри лишают волосы влаги. Результат: ломкость, тусклость, статическое электричество и сухие кончики.",
        "Первый шаг — пересмотреть шампунь. Откажитесь от сульфатных формул в пользу мягких очищающих средств. Они бережнее относятся к природным липидам, которые защищают волосы.",
        "Добавьте маску для волос минимум раз в неделю. Huile Prodigieuse от Nuxe — универсальное масло, которое питает и восстанавливает блеск не только кожи, но и волос. Нанесите на сухие кончики за 30 минут до мытья.",
        "Снизьте температуру воды при мытье — горячая вода вымывает защитные масла и делает кутикулу шершавой. Ополаскивайте волосы прохладной водой — это придаёт блеск.",
        "При использовании фена и утюжка обязательно применяйте термозащиту. Не пренебрегайте этим шагом, даже если кажется, что волосы и так держатся.",
        "Хлопковые наволочки поглощают влагу из волос. Попробуйте атласные или шелковые — они создают меньше трения и помогают сохранить укладку и здоровье волос.",
      ],
      lv: [
        "Ziema ir pārbaudījums matiem. Aukstais gaiss ārā un karstais sausais gaiss no radiatoriem iekšā atņem matiem mitrumu. Rezultāts: trauslums, blāvums, statiskā elektrība un sausi galiņi.",
        "Pirmais solis — pārskatīt šampūnu. Atsakieties no sulfātu formulām par labu maigiem attīrošiem līdzekļiem. Tie saudzīgāk izturas pret dabīgajiem lipīdiem, kas aizsargā matus.",
        "Pievienojiet matu masku vismaz reizi nedēļā. Huile Prodigieuse no Nuxe ir universāla eļļa, kas baro un atjauno spīdumu ne tikai ādai, bet arī matiem. Uzklājiet uz sausiem galiņiem 30 minūtes pirms mazgāšanas.",
        "Samaziniet ūdens temperatūru mazgāšanas laikā — karstais ūdens izskalo aizsargājošās eļļas un padara kutikulu raupju. Skalojiet matus ar vēsu ūdeni — tas piešķir spīdumu.",
        "Lietojot fēnu un gludināmo, noteikti izmantojiet termoaizsardzību. Neignorējiet šo soli, pat ja šķiet, ka mati tāpat turas.",
        "Kokvilnas spilvendrānas uzsūc mitrumu no matiem. Izmēģiniet satīna vai zīda — tās rada mazāku berzi un palīdz saglabāt sakārtojumu un matu veselību.",
      ],
    },
  },
}

function ArticleContent() {
  const { t, lang } = useLang()
  const params = useParams()
  const slug = params?.slug as string
  const article = articles[slug]

  if (!article) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">{t("blogNotFound")}</h1>
          <Link href="/blog" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> {t("blogBackToBlog")}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/blog" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> {t("blogAllArticlesLink")}
        </Link>

        <div className="overflow-hidden rounded-2xl">
          <img src={article.image || "/placeholder.svg"} alt={article.title[lang]} className="w-full aspect-video object-cover" />
        </div>

        <div className="mt-6">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Tag className="h-3 w-3" />
            {article.category[lang]}
          </span>

          <h1 className="mt-4 text-2xl font-bold leading-snug text-foreground md:text-3xl">
            {article.title[lang]}
          </h1>

          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{article.date[lang]}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{article.readTime[lang]} {t("blogReadTime")}</span>
          </div>

          <div className="mt-8 space-y-5">
            {article.content[lang].map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-foreground/80">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-border bg-secondary/50 p-6">
            <p className="text-sm font-semibold text-foreground">{t("blogUsefulTitle")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("blogUsefulText")}</p>
            <div className="mt-3 flex gap-2">
              <input
                type="email"
                placeholder={t("blogEmailPlaceholder")}
                className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
              />
              <button className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                {t("blogSubscribe")}
              </button>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> {t("blogBackToBlog")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function BlogArticlePage() {
  return (
    <LangProvider>
        <SiteHeader />
        <CartDrawer />
        <ArticleContent />
        <SiteFooter />
    </LangProvider>
  )
}
