export interface Product {
  id: number
  name: string
  brand: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  image: string
  category: string
  badge?: string
  inStock: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  subcategories: string[]
}

export const categories: Category[] = [
  {
    id: "supplements",
    name: "Supplements",
    icon: "pill",
    subcategories: [
      "Vitamins",
      "Minerals",
      "Amino Acids",
      "Antioxidants",
      "Probiotics",
      "Fish Oil & Omegas",
      "Herbs",
      "Adaptogens",
    ],
  },
  {
    id: "sports",
    name: "Sports Nutrition",
    icon: "dumbbell",
    subcategories: [
      "Protein",
      "Creatine",
      "Pre-Workout",
      "BCAAs",
      "Electrolytes",
      "Protein Bars",
    ],
  },
  {
    id: "beauty",
    name: "Beauty",
    icon: "sparkles",
    subcategories: [
      "Skin Care",
      "Hair Care",
      "Collagen",
      "Serums",
      "Face Masks",
      "Lip Care",
    ],
  },
  {
    id: "grocery",
    name: "Grocery",
    icon: "apple",
    subcategories: [
      "Tea",
      "Honey & Sweeteners",
      "Snacks",
      "Nuts & Seeds",
      "Superfoods",
      "Herbs & Spices",
    ],
  },
  {
    id: "bath",
    name: "Bath & Personal Care",
    icon: "droplets",
    subcategories: [
      "Body Wash",
      "Shampoo",
      "Oral Care",
      "Deodorant",
      "Sunscreen",
    ],
  },
  {
    id: "baby",
    name: "Baby & Kids",
    icon: "baby",
    subcategories: [
      "Children's Vitamins",
      "Baby Care",
      "Formula",
      "Snacks & Food",
    ],
  },
  {
    id: "pets",
    name: "Pets",
    icon: "pawprint",
    subcategories: [
      "Dog Supplements",
      "Cat Supplements",
      "Pet Food",
      "Grooming",
    ],
  },
  {
    id: "home",
    name: "Home",
    icon: "home",
    subcategories: [
      "Cleaning",
      "Laundry",
      "Air Fresheners",
      "Kitchen Supplies",
    ],
  },
]

export const products: Product[] = [
  {
    id: 1,
    name: "Vitamin C 1000mg with Rose Hips",
    brand: "NaturePlus",
    price: 12.99,
    originalPrice: 18.99,
    rating: 4.8,
    reviewCount: 12450,
    image: "/images/products/vitamin-c.jpg",
    category: "supplements",
    badge: "Best Seller",
    inStock: true,
  },
  {
    id: 2,
    name: "Omega-3 Fish Oil, Triple Strength",
    brand: "OceanPure",
    price: 24.95,
    originalPrice: 32.0,
    rating: 4.7,
    reviewCount: 8932,
    image: "/images/products/omega-3.jpg",
    category: "supplements",
    badge: "Popular",
    inStock: true,
  },
  {
    id: 3,
    name: "Probiotics 50 Billion CFU",
    brand: "GutHealth",
    price: 29.99,
    rating: 4.6,
    reviewCount: 6841,
    image: "/images/products/probiotics.jpg",
    category: "supplements",
    inStock: true,
  },
  {
    id: 4,
    name: "Magnesium Glycinate 400mg",
    brand: "PureMinerals",
    price: 19.5,
    originalPrice: 25.0,
    rating: 4.9,
    reviewCount: 15200,
    image: "/images/products/magnesium.jpg",
    category: "supplements",
    badge: "Top Rated",
    inStock: true,
  },
  {
    id: 5,
    name: "Vitamin D3 5000 IU Drops",
    brand: "SunVita",
    price: 14.75,
    rating: 4.7,
    reviewCount: 9340,
    image: "/images/products/vitamin-d.jpg",
    category: "supplements",
    inStock: true,
  },
  {
    id: 6,
    name: "Collagen Peptides Powder",
    brand: "BeautyBlend",
    price: 34.99,
    originalPrice: 44.99,
    rating: 4.5,
    reviewCount: 7623,
    image: "/images/products/collagen.jpg",
    category: "beauty",
    badge: "22% Off",
    inStock: true,
  },
  {
    id: 7,
    name: "Whey Protein Isolate, Chocolate",
    brand: "FitFuel",
    price: 39.99,
    originalPrice: 49.99,
    rating: 4.6,
    reviewCount: 5412,
    image: "/images/products/whey-protein.jpg",
    category: "sports",
    badge: "Sale",
    inStock: true,
  },
  {
    id: 8,
    name: "Zinc 50mg, Enhanced Absorption",
    brand: "PureMinerals",
    price: 8.99,
    rating: 4.5,
    reviewCount: 4210,
    image: "/images/products/zinc.jpg",
    category: "supplements",
    inStock: true,
  },
  {
    id: 9,
    name: "Ashwagandha Root Extract 600mg",
    brand: "HerbWise",
    price: 16.49,
    originalPrice: 22.0,
    rating: 4.8,
    reviewCount: 11300,
    image: "/images/products/ashwagandha.jpg",
    category: "supplements",
    badge: "Trending",
    inStock: true,
  },
  {
    id: 10,
    name: "Complete Multivitamin for Adults",
    brand: "NaturePlus",
    price: 22.0,
    rating: 4.4,
    reviewCount: 3890,
    image: "/images/products/multivitamin.jpg",
    category: "supplements",
    inStock: true,
  },
  {
    id: 11,
    name: "Turmeric Curcumin 1500mg",
    brand: "GoldenRoot",
    price: 18.99,
    originalPrice: 24.99,
    rating: 4.7,
    reviewCount: 6750,
    image: "/images/products/turmeric.jpg",
    category: "supplements",
    badge: "24% Off",
    inStock: true,
  },
  {
    id: 12,
    name: "Creatine Monohydrate Powder",
    brand: "FitFuel",
    price: 27.5,
    rating: 4.8,
    reviewCount: 8900,
    image: "/images/products/creatine.jpg",
    category: "sports",
    badge: "Best Seller",
    inStock: true,
  },
]

export const promoBarItems = [
  "20% off all Vitamins & Supplements",
  "Free Shipping on orders over $30",
  "New Customers: Extra 10% off with code WELCOME10",
]
