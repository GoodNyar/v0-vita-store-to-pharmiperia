import {
  Sparkles,
  Droplets,
  Heart,
  Sun,
  Paintbrush,
  User,
  Baby,
  Tag,
} from "lucide-react"

const quickCategories = [
  { name: "Skincare", icon: Sparkles, color: "bg-primary/10 text-primary" },
  { name: "Haircare", icon: Droplets, color: "bg-accent/10 text-accent" },
  { name: "Body Care", icon: Heart, color: "bg-destructive/10 text-destructive" },
  { name: "Sun Protection", icon: Sun, color: "bg-accent/10 text-accent" },
  { name: "Makeup", icon: Paintbrush, color: "bg-primary/10 text-primary" },
  { name: "Men Care", icon: User, color: "bg-accent/10 text-accent" },
  { name: "Baby & Mom", icon: Baby, color: "bg-primary/10 text-primary" },
  { name: "Brands", icon: Tag, color: "bg-destructive/10 text-destructive" },
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
            <span className="text-xs font-medium text-card-foreground text-center">
              {cat.name}
            </span>
          </a>
        )
      })}
    </div>
  )
}
