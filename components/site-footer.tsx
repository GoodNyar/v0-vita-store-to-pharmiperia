import { Leaf } from "lucide-react"

const footerLinks = {
  "Shop": [
    "Supplements",
    "Sports Nutrition",
    "Beauty",
    "Grocery",
    "Bath & Personal Care",
    "Baby & Kids",
  ],
  "Help": [
    "Help Center",
    "Track Order",
    "Shipping Info",
    "Returns & Refunds",
    "Contact Us",
  ],
  "Company": [
    "About Us",
    "Blog",
    "Careers",
    "Press",
    "Affiliate Program",
  ],
  "Account": [
    "Sign In",
    "Create Account",
    "My Orders",
    "My Lists",
    "Rewards",
  ],
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Leaf className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">
                VitaStore
              </span>
            </a>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Your trusted source for vitamins, supplements, and natural health
              products. Shipped worldwide.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-foreground">{title}</h4>
              <ul className="mt-3 flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            2026 VitaStore. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="transition-colors hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
