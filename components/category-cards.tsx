import {
  Pill,
  Dumbbell,
  Sparkles,
  Apple,
  Droplets,
  Baby,
  PawPrint,
  Home,
} from "lucide-react"

const quickCategories = [
  { name: "Supplements", icon: Pill, color: "bg-primary/10 text-primary" },
  { name: "Sports", icon: Dumbbell, color: "bg-accent/10 text-accent" },
  { name: "Beauty", icon: Sparkles, color: "bg-destructive/10 text-destructive" },
  { name: "Grocery", icon: Apple, color: "bg-primary/10 text-primary" },
  { name: "Bath", icon: Droplets, color: "bg-accent/10 text-accent" },
  { name: "Baby", icon: Baby, color: "bg-primary/10 text-primary" },
  { name: "Pets", icon: PawPrint, color: "bg-accent/10 text-accent" },
  { name: "Home", icon: Home, color: "bg-primary/10 text-primary" },
]

export function CategoryCards() {
  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
      {quickCategories.map((cat) => {
        const Icon = cat.icon
        return (
          <a
            key={cat.name}
            href="#"
            className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${cat.color}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-card-foreground">
              {cat.name}
            </span>
          </a>
        )
      })}
    </div>
  )
}
