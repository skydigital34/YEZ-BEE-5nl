export const CATEGORY_CONFIG = {
  casuals: {
    label: "Casuals",
    subcategories: ["feeding", "non-feeding"]
  },
  "party-wear": {
    label: "Party Wear",
    subcategories: ["feeding", "non-feeding"]
  },
  "ethnic-wear": {
    label: "Ethnic Wear",
    subcategories: ["feeding", "non-feeding"]
  },
  "lounge-wear": {
    label: "Lounge Wear",
    subcategories: []
  },
  "peplum-tops": {
    label: "Peplum Tops",
    subcategories: ["feeding", "non-feeding"]
  },
  "kids-wear": {
    label: "Kids Sets",
    subcategories: []
  }
} as const;

export type CategorySlug = keyof typeof CATEGORY_CONFIG;

export interface SubcategoryConfig {
  id: string;
  name: string;
  slug: string;
  path: string;
  productType: 'FEEDING' | 'NON-FEEDING';
  description: string;
}

export interface CategoryConfig {
  id: string;
  name: string;
  slug: string;
  path: string;
  description: string;
  image: string;
  banner?: string;
  sortOrder: number;
  hasFeedingSplit: boolean;
  subcategories: SubcategoryConfig[];
  itemCount?: string;
}

export const YEZBEE_CATEGORIES: CategoryConfig[] = [
  {
    id: 'casuals',
    name: 'CASUALS',
    slug: 'casuals',
    path: '/category/casuals',
    description: 'Effortless everyday styles designed for comfort and elegance.',
    image: '/images/categories/casuals.png',
    banner: '/images/categories/casuals.png',
    sortOrder: 1,
    hasFeedingSplit: true,
    subcategories: [
      {
        id: 'casuals-feeding',
        name: 'FEEDING',
        slug: 'feeding',
        path: '/category/casuals/feeding',
        productType: 'FEEDING',
        description: 'Everyday casual outfits crafted with discreet concealed feeding zippers.',
      },
      {
        id: 'casuals-non-feeding',
        name: 'NON-FEEDING',
        slug: 'non-feeding',
        path: '/category/casuals/non-feeding',
        productType: 'NON-FEEDING',
        description: 'Everyday casual kurtis, tops, and dresses with standard non-feeding silhouettes.',
      },
    ],
  },
  {
    id: 'party-wear',
    name: 'PARTY WEAR',
    slug: 'party-wear',
    path: '/category/party-wear',
    description: 'Glamorous evening dresses, flared gowns, and festive party outfits.',
    image: '/images/categories/partywear.png',
    banner: '/images/categories/partywear.png',
    sortOrder: 2,
    hasFeedingSplit: true,
    subcategories: [
      {
        id: 'party-wear-feeding',
        name: 'FEEDING',
        slug: 'feeding',
        path: '/category/party-wear/feeding',
        productType: 'FEEDING',
        description: 'Elegant party wear featuring hidden nursing access for celebrations.',
      },
      {
        id: 'party-wear-non-feeding',
        name: 'NON-FEEDING',
        slug: 'non-feeding',
        path: '/category/party-wear/non-feeding',
        productType: 'NON-FEEDING',
        description: 'Statement gowns, maxi dresses, and trendy party outfits.',
      },
    ],
  },
  {
    id: 'ethnic-wear',
    name: 'ETHNIC WEAR',
    slug: 'ethnic-wear',
    path: '/category/ethnic-wear',
    description: 'Traditional kurtis, anarkalis, and beautifully embroidered suits.',
    image: '/images/categories/ethnic-wear.png',
    banner: '/images/categories/ethnic-wear.png',
    sortOrder: 3,
    hasFeedingSplit: true,
    subcategories: [
      {
        id: 'ethnic-wear-feeding',
        name: 'FEEDING',
        slug: 'feeding',
        path: '/category/ethnic-wear/feeding',
        productType: 'FEEDING',
        description: 'Festive ethnic wear designed with convenient zip access for nursing mothers.',
      },
      {
        id: 'ethnic-wear-non-feeding',
        name: 'NON-FEEDING',
        slug: 'non-feeding',
        path: '/category/ethnic-wear/non-feeding',
        productType: 'NON-FEEDING',
        description: 'Classic traditional kurtis, lehengas, and suits for all festive occasions.',
      },
    ],
  },
  {
    id: 'lounge-wear',
    name: 'LOUNGE WEAR',
    slug: 'lounge-wear',
    path: '/category/lounge-wear',
    description: 'Relaxed fits, ultra-soft nightwear, and comfortable sets.',
    image: '/images/image copy 5.png',
    banner: '/images/image copy 5.png',
    sortOrder: 4,
    hasFeedingSplit: false,
    subcategories: [],
  },
  {
    id: 'peplum-tops',
    name: 'PEPLUM TOPS',
    slug: 'peplum-tops',
    path: '/category/peplum-tops',
    description: 'Chic, flared peplum tops that flatter every silhouette.',
    image: '/images/categories/peplumtops.png',
    banner: '/images/categories/peplumtops.png',
    sortOrder: 5,
    hasFeedingSplit: true,
    subcategories: [
      {
        id: 'peplum-tops-feeding',
        name: 'FEEDING',
        slug: 'feeding',
        path: '/category/peplum-tops/feeding',
        productType: 'FEEDING',
        description: 'Stylish peplum tops engineered with subtle zippers for easy nursing.',
      },
      {
        id: 'peplum-tops-non-feeding',
        name: 'NON-FEEDING',
        slug: 'non-feeding',
        path: '/category/peplum-tops/non-feeding',
        productType: 'NON-FEEDING',
        description: 'Trendy peplum tops perfect for casual outings and workwear.',
      },
    ],
  },
  {
    id: 'kids-wear',
    name: 'KIDS SETS',
    slug: 'kids-wear',
    path: '/category/kids-wear',
    description: 'Adorable, soft, and playful clothing for the little ones.',
    image: '/images/image copy 4.png',
    banner: '/images/image copy 4.png',
    sortOrder: 6,
    hasFeedingSplit: false,
    subcategories: [],
  },
];

const LEGACY_SLUG_MAP: Record<string, { categorySlug: string; productType?: 'FEEDING' | 'NON-FEEDING' }> = {
  'maternity-kurtis': { categorySlug: 'casuals', productType: 'FEEDING' },
  'maternity-feeding-loungewears': { categorySlug: 'lounge-wear', productType: 'FEEDING' },
  'maternity-intimatewears': { categorySlug: 'lounge-wear', productType: 'FEEDING' },
  'non-maternity-kurtis-dresses': { categorySlug: 'casuals', productType: 'NON-FEEDING' },
  'kids-clothing': { categorySlug: 'kids-wear' },
  'loungewear': { categorySlug: 'lounge-wear', productType: 'NON-FEEDING' },
};

export function resolveLegacyCategorySlug(slug: string): { categorySlug: string; productType?: 'FEEDING' | 'NON-FEEDING' } | undefined {
  const normalized = slug.toLowerCase().trim();
  return LEGACY_SLUG_MAP[normalized];
}

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  const normalized = slug.toLowerCase().trim();
  const directMatch = YEZBEE_CATEGORIES.find(
    (c) => c.slug === normalized || c.id === normalized
  );
  if (directMatch) return directMatch;

  const legacy = resolveLegacyCategorySlug(normalized);
  if (legacy) {
    return YEZBEE_CATEGORIES.find((c) => c.slug === legacy.categorySlug);
  }
  return undefined;
}

export function getCategoryWithSubcategory(
  categorySlug: string,
  subSlug?: string
): { category: CategoryConfig; subcategory?: SubcategoryConfig } | undefined {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return undefined;

  if (!subSlug) return { category };

  const subNormalized = subSlug.toLowerCase().trim();
  const subcategory = category.subcategories.find(
    (s) => s.slug === subNormalized || s.id === subNormalized || s.productType.toLowerCase() === subNormalized
  );

  return { category, subcategory };
}

export function hasFeedingSplit(categorySlug: string): boolean {
  const cat = getCategoryBySlug(categorySlug);
  return cat ? cat.hasFeedingSplit : false;
}

export function getAllCategorySlugs(): string[] {
  const slugs: string[] = [];
  YEZBEE_CATEGORIES.forEach((cat) => {
    slugs.push(cat.slug);
    cat.subcategories.forEach((sub) => {
      slugs.push(`${cat.slug}/${sub.slug}`);
    });
  });
  return slugs;
}
