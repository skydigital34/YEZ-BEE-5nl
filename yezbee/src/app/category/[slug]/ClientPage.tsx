'use client';

import { useState, useCallback, useEffect, useMemo, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  List,
  Filter,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Maximize2,
  Ruler,
  Info,
  Check,
} from 'lucide-react';

const SIZE_CHART_DATA = [
  { size: 'S (36)', bust: '36"', waist: '32"', hip: '39"', length: '44"', shoulder: '14.5"' },
  { size: 'M (38)', bust: '38"', waist: '34"', hip: '41"', length: '44"', shoulder: '15"' },
  { size: 'L (40)', bust: '40"', waist: '36"', hip: '43"', length: '45"', shoulder: '15.5"' },
  { size: 'XL (42)', bust: '42"', waist: '38"', hip: '45"', length: '45"', shoulder: '16"' },
  { size: '2XL (44)', bust: '44"', waist: '40"', hip: '47"', length: '46"', shoulder: '16.5"' },
  { size: '3XL (46)', bust: '46"', waist: '42"', hip: '49"', length: '46"', shoulder: '17"' },
];
import ProductCard from '@/components/ui/ProductCard';
import {
  YEZBEE_CATEGORIES,
  getCategoryBySlug,
} from '@/data/categories';
import { getAllProducts } from '@/data/products';
import { extractProducts, normalizeProduct, matchesCategory } from '@/lib/utils';
import { api } from '@/lib/api';

const WOMEN_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'] as const;
const KIDS_SIZES = ['0-1Y', '1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y', '8-10Y', '10-12Y', '12-14Y'] as const;

const COLORS = [
  { name: 'Peach Floral', hex: '#FFDAB9' },
  { name: 'Blush Pink', hex: '#FFB6C1' },
  { name: 'Navy Blue', hex: '#1B2A4A' },
  { name: 'Sage Green', hex: '#8FBC8F' },
  { name: 'Maroon Gold', hex: '#800000' },
  { name: 'Teal Blue', hex: '#008080' },
  { name: 'Lavender', hex: '#E6E6FA' },
  { name: 'Coral Pink', hex: '#FF6F61' },
];

const FABRICS = ['100% Pure Cotton', 'Soft Premium Rayon', 'Modal Cotton Knit', 'Microfiber Nylon', 'Combed Cotton', 'Silk Georgette Blend', 'Schiffli Cotton'];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'bestselling', label: 'Bestselling Patrons Choice' },
  { value: 'rating', label: 'Highest Rated' },
];

interface FilterSidebarProps {
  slug: string;
  subSlug?: string;
  categoryConfig: any;
  showProductTypeFilter: boolean;
  selectedProductType: string;
  setSelectedProductType: (val: string) => void;
  availableSizeList: readonly string[];
  selectedSizes: string[];
  toggleSize: (sz: string) => void;
  selectedColors: string[];
  toggleColor: (c: string) => void;
  selectedFabrics: string[];
  toggleFabric: (f: string) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  expandedSections: Record<string, boolean>;
  setExpandedSections: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  activeFilterCount: number;
  clearAllFilters: () => void;
  router: any;
}

function FilterSidebar({
  slug,
  subSlug,
  categoryConfig,
  showProductTypeFilter,
  selectedProductType,
  setSelectedProductType,
  availableSizeList,
  selectedSizes,
  toggleSize,
  selectedColors,
  toggleColor,
  selectedFabrics,
  toggleFabric,
  inStockOnly,
  setInStockOnly,
  expandedSections,
  setExpandedSections,
  activeFilterCount,
  clearAllFilters,
  router,
}: FilterSidebarProps) {
  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl border border-[var(--color-champagne)]/60 shadow-soft-sm" suppressHydrationWarning>
      <div className="flex items-center justify-between pb-4 border-b border-[var(--color-champagne)]" suppressHydrationWarning>
        <h3 className="font-display font-bold text-sm uppercase tracking-wider text-[var(--color-dark)] flex items-center gap-2" suppressHydrationWarning>
          <Filter size={14} className="text-[var(--color-primary-gold)]" /> Filters
        </h3>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs text-[var(--color-primary-gold)] hover:underline font-semibold"
            suppressHydrationWarning
          >
            Clear All ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="pb-4 border-b border-[var(--color-champagne)]" suppressHydrationWarning>
        <button
          type="button"
          onClick={() => setExpandedSections((prev) => ({ ...prev, category: !prev.category }))}
          className="flex items-center justify-between w-full text-left font-semibold text-xs uppercase tracking-wider text-[var(--color-dark)]"
          suppressHydrationWarning
        >
          <span>Categories</span>
          {expandedSections.category ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {expandedSections.category && (
          <div className="mt-3 space-y-1.5 text-xs font-sans" suppressHydrationWarning>
            {YEZBEE_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.path}
                className={`block py-2 px-3 rounded-xl transition-all ${slug === cat.slug
                  ? 'bg-[var(--color-dark)] text-white font-bold shadow-sm'
                  : 'text-[var(--color-dark)]/80 hover:bg-[var(--color-champagne)]/40 hover:text-[var(--color-dark)] font-semibold'
                  }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {showProductTypeFilter && (
        <div className="pb-4 border-b border-[var(--color-champagne)]" suppressHydrationWarning>
          <button
            type="button"
            onClick={() => setExpandedSections((prev) => ({ ...prev, productType: !prev.productType }))}
            className="flex items-center justify-between w-full text-left font-semibold text-xs uppercase tracking-wider text-[var(--color-dark)]"
            suppressHydrationWarning
          >
            <span>Product Type</span>
            {expandedSections.productType ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {expandedSections.productType && (
            <div className="mt-3 space-y-2 text-xs font-sans" suppressHydrationWarning>
              <button
                type="button"
                onClick={() => {
                  setSelectedProductType('all');
                  if (subSlug) router.push(`/category/${slug}`);
                }}
                className={`w-full text-left py-2 px-3 rounded-xl border text-xs font-bold transition-all ${selectedProductType === 'all'
                  ? 'bg-[var(--color-dark)] text-white border-[var(--color-dark)]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                  }`}
                suppressHydrationWarning
              >
                All {categoryConfig ? categoryConfig.name : 'Products'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedProductType('FEEDING');
                  router.push(`/category/${slug}/feeding`);
                }}
                className={`w-full text-left py-2 px-3 rounded-xl border text-xs font-bold transition-all ${selectedProductType === 'FEEDING'
                  ? 'bg-[var(--color-dark)] text-white border-[var(--color-dark)] shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                  }`}
                suppressHydrationWarning
              >
                FEEDING
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedProductType('NON-FEEDING');
                  router.push(`/category/${slug}/non-feeding`);
                }}
                className={`w-full text-left py-2 px-3 rounded-xl border text-xs font-bold transition-all ${selectedProductType === 'NON-FEEDING'
                  ? 'bg-[var(--color-dark)] text-white border-[var(--color-dark)] shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                  }`}
                suppressHydrationWarning
              >
                NON-FEEDING
              </button>
            </div>
          )}
        </div>
      )}

      <div className="pb-4 border-b border-[var(--color-champagne)]" suppressHydrationWarning>
        <button
          type="button"
          onClick={() => setExpandedSections((prev) => ({ ...prev, size: !prev.size }))}
          className="flex items-center justify-between w-full text-left font-semibold text-xs uppercase tracking-wider text-[var(--color-dark)]"
          suppressHydrationWarning
        >
          <span>Size</span>
          {expandedSections.size ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {expandedSections.size && (
          <div className="mt-3 flex flex-wrap gap-2" suppressHydrationWarning>
            {availableSizeList.map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => toggleSize(sz)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${selectedSizes.includes(sz)
                  ? 'bg-[var(--color-dark)] text-white border-[var(--color-dark)] shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                  }`}
                suppressHydrationWarning
              >
                {sz}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pb-4 border-b border-[var(--color-champagne)]" suppressHydrationWarning>
        <button
          type="button"
          onClick={() => setExpandedSections((prev) => ({ ...prev, color: !prev.color }))}
          className="flex items-center justify-between w-full text-left font-semibold text-xs uppercase tracking-wider text-[var(--color-dark)]"
          suppressHydrationWarning
        >
          <span>Color Palette</span>
          {expandedSections.color ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {expandedSections.color && (
          <div className="mt-3 grid grid-cols-4 gap-2" suppressHydrationWarning>
            {COLORS.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => toggleColor(color.name)}
                className={`w-8 h-8 rounded-full border border-gray-300 transition-all ${selectedColors.includes(color.name)
                  ? 'ring-2 ring-[var(--color-primary-gold)] ring-offset-2 scale-110'
                  : 'hover:scale-105'
                  }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={`Filter by color ${color.name}`}
                suppressHydrationWarning
              />
            ))}
          </div>
        )}
      </div>

      <div className="pb-4 border-b border-[var(--color-champagne)]" suppressHydrationWarning>
        <button
          type="button"
          onClick={() => setExpandedSections((prev) => ({ ...prev, fabric: !prev.fabric }))}
          className="flex items-center justify-between w-full text-left font-semibold text-xs uppercase tracking-wider text-[var(--color-dark)]"
          suppressHydrationWarning
        >
          <span>Fabrics</span>
          {expandedSections.fabric ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {expandedSections.fabric && (
          <div className="mt-3 space-y-2" suppressHydrationWarning>
            {FABRICS.map((fabric) => (
              <label
                key={fabric}
                className="flex items-center gap-2 text-xs text-[var(--color-dark)]/80 cursor-pointer hover:text-[var(--color-primary-gold)] font-medium"
                suppressHydrationWarning
              >
                <input
                  type="checkbox"
                  checked={selectedFabrics.includes(fabric)}
                  onChange={() => toggleFabric(fabric)}
                  className="rounded border-gray-300 text-[var(--color-primary-gold)] focus:ring-[var(--color-primary-gold)]"
                />
                <span>{fabric}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div suppressHydrationWarning>
        <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--color-dark)] cursor-pointer" suppressHydrationWarning>
          <span>In Stock Only</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="rounded border-gray-300 text-[var(--color-primary-gold)] focus:ring-[var(--color-primary-gold)] h-4 w-4"
          />
        </label>
      </div>
    </div>
  );
}

export function CategoryPageContent({ subSlug }: { subSlug?: string }) {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const slug = (params?.slug as string) || 'all';

  const queryProductType = searchParams.get('type') || searchParams.get('productType');
  const initialTypeFilter = subSlug
    ? subSlug.toUpperCase() === 'FEEDING' ? 'FEEDING' : subSlug.toUpperCase() === 'NON-FEEDING' ? 'NON-FEEDING' : 'all'
    : queryProductType ? queryProductType.toUpperCase() as 'FEEDING' | 'NON-FEEDING' | 'all' : 'all';

  const categoryConfig = getCategoryBySlug(slug);
  const showProductTypeFilter = categoryConfig ? categoryConfig.hasFeedingSplit : (slug === 'all');

  const isKidsCategory = slug === 'kids-wear' || slug === 'kids-clothing';
  const availableSizeList = isKidsCategory ? KIDS_SIZES : WOMEN_SIZES;

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProductType, setSelectedProductType] = useState<string>(initialTypeFilter);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [visibleCount, setVisibleCount] = useState(48);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    productType: true,
    color: true,
    fabric: true,
    size: true,
  });

  useEffect(() => {
    if (subSlug) {
      const upper = subSlug.toUpperCase();
      if (upper === 'FEEDING' || upper === 'NON-FEEDING') {
        setSelectedProductType(upper);
      }
    }
  }, [subSlug]);

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  useEffect(() => {
    const sizeParam = searchParams.get('size');
    if (!sizeParam) {
      setSelectedSizes([]);
    } else {
      setSelectedSizes(sizeParam.split(','));
    }
  }, [searchParams]);

  const updateSizeUrl = useCallback(
    (sizes: string[]) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (sizes.length === 0) {
        current.delete('size');
      } else {
        current.set('size', sizes.join(','));
      }
      const query = current.toString();
      router.replace(`?${query}`, { scroll: false });
    },
    [router, searchParams]
  );

  const toggleSize = useCallback(
    (size: string) => {
      setSelectedSizes((prev) => {
        const next = prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size];
        updateSizeUrl(next);
        return next;
      });
    },
    [updateSizeUrl]
  );

  const toggleColor = (color: string) =>
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );

  const toggleFabric = (fabric: string) =>
    setSelectedFabrics((prev) =>
      prev.includes(fabric) ? prev.filter((f) => f !== fabric) : [...prev, fabric]
    );

  const clearAllFilters = useCallback(() => {
    setSelectedColors([]);
    setSelectedFabrics([]);
    setSelectedProductType('all');
    setInStockOnly(false);
    setSelectedSizes([]);
    updateSizeUrl([]);
  }, [updateSizeUrl]);

  const activeFilterCount =
    (selectedProductType !== 'all' ? 1 : 0) +
    selectedColors.length +
    selectedSizes.length +
    selectedFabrics.length +
    (inStockOnly ? 1 : 0);

  // Initialize with static products so SSR and initial client render match 100%
  const [dbProducts, setDbProducts] = useState<any[]>(() => {
    const all = getAllProducts().map((p: any) => normalizeProduct(p)).filter(Boolean);
    const filtered = all.filter((p: any) => matchesCategory(p, slug, initialTypeFilter));
    return slug === 'all' ? all : (filtered.length > 0 ? filtered : all.filter((p: any) => matchesCategory(p, slug)));
  });

  useEffect(() => {
    let isMountedFlag = true;
    const fetchLiveProducts = async () => {
      try {
        const response = await api.getProducts({
          limit: 100,
          sortBy,
        });

        if (!isMountedFlag) return;
        const raw = extractProducts(response);
        const normalized = (raw.length > 0 ? raw : getAllProducts()).map((p: any) => normalizeProduct(p)).filter(Boolean);
        const filtered = normalized.filter((p: any) => matchesCategory(p, slug, selectedProductType));

        setDbProducts(slug === 'all' ? normalized : (filtered.length > 0 ? filtered : normalized.filter((p: any) => matchesCategory(p, slug))));
      } catch (error) {
        if (isMountedFlag) {
          const fallback = getAllProducts().map((p: any) => normalizeProduct(p)).filter(Boolean);
          const filtered = fallback.filter((p: any) => matchesCategory(p, slug, selectedProductType));
          setDbProducts(slug === 'all' ? fallback : (filtered.length > 0 ? filtered : fallback));
        }
      }
    };

    fetchLiveProducts();
    if (typeof window !== 'undefined') {
      window.addEventListener('yezbee_products_updated', fetchLiveProducts);
    }
    return () => {
      isMountedFlag = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('yezbee_products_updated', fetchLiveProducts);
      }
    };
  }, [slug, selectedProductType, selectedSizes, selectedColors, sortBy]);

  const filteredProducts = useMemo(() => {
    return dbProducts.filter((p) => {
      if (selectedColors.length && !p.colors?.some((c: any) => selectedColors.includes(typeof c === 'string' ? c : c.name))) {
        return false;
      }

      if (selectedSizes.length) {
        const hasMatchingSize = selectedSizes.some((s) => p.sizes?.includes(s));
        if (!hasMatchingSize) return false;
      }

      if (selectedFabrics.length && !selectedFabrics.includes(p.fabric)) return false;

      if (inStockOnly && p.stock <= 0) return false;

      return true;
    });
  }, [dbProducts, selectedColors, selectedSizes, selectedFabrics, inStockOnly]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'bestselling':
          return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
        case 'rating':
          return b.rating - a.rating;
        default:
          return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
      }
    });
  }, [filteredProducts, sortBy]);

  const displayedProducts = sortedProducts.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] font-sans" suppressHydrationWarning>
      <div className="relative bg-black text-white overflow-hidden py-16 sm:py-24 border-b border-[var(--color-primary-gold)]/40" suppressHydrationWarning>
        <Image
          src={categoryConfig?.banner || '/images/categories/maternity-kurtis.jpg'}
          alt={categoryConfig?.name || 'Category'}
          fill
          priority
          className="object-cover object-center opacity-35"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-white/60 mb-4 font-sans uppercase tracking-widest">
                <Link href="/" className="hover:text-[var(--color-primary-gold)] transition-colors">Home</Link>
                <span>/</span>
                <Link href="/category/all" className="hover:text-[var(--color-primary-gold)] transition-colors">Categories</Link>
                <span>/</span>
                <span className="text-[var(--color-primary-gold)] font-bold">
                  {categoryConfig?.name || 'Catalog'}
                </span>
                {selectedProductType !== 'all' && (
                  <>
                    <span>/</span>
                    <span className="text-white font-bold">{selectedProductType}</span>
                  </>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight uppercase">
                {categoryConfig?.name || 'All Products'}
                {selectedProductType !== 'all' && (
                  <span className="text-[var(--color-primary-gold)] ml-3 text-2xl sm:text-4xl">· {selectedProductType}</span>
                )}
              </h1>

              <p className="mt-4 text-xs sm:text-sm text-white/80 leading-relaxed font-sans max-w-xl">
                {categoryConfig?.description || 'Explore our exclusive fashion collection handcrafted for elegance and comfort.'}
              </p>
            </div>

            {/* Top Right Luxury Measurement Guide Widget */}
            <div className="shrink-0 flex flex-col items-start lg:items-end">
              <div
                onClick={() => setIsSizeChartOpen(true)}
                className="group relative bg-gradient-to-br from-black/90 via-zinc-900/95 to-black/95 backdrop-blur-xl border border-[var(--color-primary-gold)]/40 hover:border-[var(--color-primary-gold)] p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 shadow-2xl hover:shadow-[0_0_30px_rgba(212,175,55,0.25)] hover:scale-[1.02] max-w-xs sm:max-w-sm"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[var(--color-gold-light)] bg-[var(--color-primary-gold)]/15 px-2.5 py-1 rounded-full border border-[var(--color-primary-gold)]/30">
                    <Ruler size={13} className="text-[var(--color-primary-gold)]" /> Size & Fit Guide
                  </span>
                  <span className="text-[10px] font-semibold text-white/70 group-hover:text-white transition-colors flex items-center gap-1">
                    Open Table <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-bold text-white mb-2">Women & Maternity Size Specs</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['S (36)', 'M (38)', 'L (40)', 'XL (42)', '2XL (44)', '3XL (46)'].map((sz) => (
                      <span
                        key={sz}
                        className="px-2 py-1 text-center text-[10px] font-bold rounded-lg bg-white/10 text-white border border-white/15 group-hover:border-[var(--color-primary-gold)]/50 group-hover:bg-[var(--color-primary-gold)]/20 transition-all"
                      >
                        {sz}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-white/70 border-t border-white/10 pt-2 font-sans">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[var(--color-primary-gold)] shrink-0" />
                    Comfort Bump Fit Guide
                  </span>
                  <span className="text-[var(--color-primary-gold)] font-bold">Inches (in)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10" suppressHydrationWarning>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[var(--color-champagne)]">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowMobileFilter(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-dark)] text-white text-xs font-bold uppercase rounded-xl"
              suppressHydrationWarning
            >
              <Filter size={14} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>

            <p className="text-xs text-gray-500 font-semibold" suppressHydrationWarning>
              Showing <span className="font-bold text-black" suppressHydrationWarning>{displayedProducts.length}</span> of{' '}
              <span className="font-bold text-black" suppressHydrationWarning>{sortedProducts.length}</span> styles
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-bold uppercase text-gray-500 hidden sm:block">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 text-xs font-bold border border-gray-300 rounded-xl bg-white outline-none focus:border-[var(--color-primary-gold)] cursor-pointer"
              suppressHydrationWarning
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <div className="hidden sm:flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[var(--color-dark)] text-white' : 'text-gray-400 hover:text-black'}`}
                aria-label="Grid view"
                suppressHydrationWarning
              >
                <Grid3X3 size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-[var(--color-dark)] text-white' : 'text-gray-400 hover:text-black'}`}
                aria-label="List view"
                suppressHydrationWarning
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="hidden lg:block lg:col-span-3 sticky top-24" suppressHydrationWarning>
            <FilterSidebar
              slug={slug}
              subSlug={subSlug}
              categoryConfig={categoryConfig}
              showProductTypeFilter={showProductTypeFilter}
              selectedProductType={selectedProductType}
              setSelectedProductType={setSelectedProductType}
              availableSizeList={availableSizeList}
              selectedSizes={selectedSizes}
              toggleSize={toggleSize}
              selectedColors={selectedColors}
              toggleColor={toggleColor}
              selectedFabrics={selectedFabrics}
              toggleFabric={toggleFabric}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              expandedSections={expandedSections}
              setExpandedSections={setExpandedSections}
              activeFilterCount={activeFilterCount}
              clearAllFilters={clearAllFilters}
              router={router}
            />
          </div>

          <div className="lg:col-span-9" suppressHydrationWarning>
            {displayedProducts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-6'
                }
              >
                {displayedProducts.map((prod) => (
                  <ProductCard key={prod.id} {...(prod as any)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 px-6 bg-white rounded-3xl border border-gray-200 shadow-soft-sm max-w-lg mx-auto">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
                  <ShoppingBag size={28} className="text-[var(--color-primary-gold)]" />
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
                  No products available in this category yet.
                </h3>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                  We are updating our catalog with fresh couture drops. Explore other categories or reset your active filters.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="px-6 py-2.5 bg-gray-100 text-gray-800 text-xs font-bold rounded-full hover:bg-gray-200 transition-all"
                      suppressHydrationWarning
                    >
                      Clear Active Filters
                    </button>
                  )}
                  <Link
                    href="/category/casuals"
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--color-dark)] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-black transition-all shadow-md"
                  >
                    Continue Shopping <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}

            {displayedProducts.length < sortedProducts.length && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="px-8 py-3 bg-[var(--color-dark)] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-black transition-all shadow-md"
                  suppressHydrationWarning
                >
                  Load More Styles ({sortedProducts.length - displayedProducts.length} remaining)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showMobileFilter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden flex justify-end"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-xs bg-white h-full overflow-y-auto p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-gray-200 mb-6">
                  <h3 className="font-bold text-sm uppercase tracking-wider">Filters</h3>
                  <button type="button" onClick={() => setShowMobileFilter(false)} className="p-1" suppressHydrationWarning>
                    <X size={20} />
                  </button>
                </div>
                <FilterSidebar
                  slug={slug}
                  subSlug={subSlug}
                  categoryConfig={categoryConfig}
                  showProductTypeFilter={showProductTypeFilter}
                  selectedProductType={selectedProductType}
                  setSelectedProductType={setSelectedProductType}
                  availableSizeList={availableSizeList}
                  selectedSizes={selectedSizes}
                  toggleSize={toggleSize}
                  selectedColors={selectedColors}
                  toggleColor={toggleColor}
                  selectedFabrics={selectedFabrics}
                  toggleFabric={toggleFabric}
                  inStockOnly={inStockOnly}
                  setInStockOnly={setInStockOnly}
                  expandedSections={expandedSections}
                  setExpandedSections={setExpandedSections}
                  activeFilterCount={activeFilterCount}
                  clearAllFilters={clearAllFilters}
                  router={router}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowMobileFilter(false)}
                className="w-full py-3 bg-[var(--color-dark)] text-white text-xs font-bold uppercase rounded-xl mt-6"
                suppressHydrationWarning
              >
                Apply Filters
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Luxury Measurement Table Modal */}
      <AnimatePresence>
        {isSizeChartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSizeChartOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[var(--color-warm-white)] rounded-3xl p-5 sm:p-8 shadow-2xl overflow-hidden border border-[var(--color-primary-gold)]/40 max-h-[90vh] flex flex-col cursor-default"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[var(--color-champagne)]">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--color-primary-gold)] mb-1">
                    <Ruler size={14} /> YEZ BEE Official Size Chart
                  </div>
                  <h3 className="font-display font-bold text-2xl text-[var(--color-dark)]">
                    Maternity & Women Measurement Guide
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSizeChartOpen(false)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-[var(--color-dark)] hover:text-white text-gray-600 transition-all cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto py-5 space-y-5 flex-1 pr-1">
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
                  <Info size={18} className="text-[var(--color-primary-gold)] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Comfort & Bump Fit Advice:</p>
                    <p className="mt-0.5 text-amber-800 leading-relaxed">
                      All YEZ BEE maternity kurtis and feeding dresses are tailored with built-in belly ease. Order your pre-pregnancy bust size for the regular fit!
                    </p>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-2xl border border-[var(--color-champagne)] shadow-soft-sm bg-white">
                  <table className="w-full text-left text-xs sm:text-sm font-sans border-collapse">
                    <thead>
                      <tr className="bg-[var(--color-dark)] text-white font-display text-xs uppercase tracking-wider">
                        <th className="py-3.5 px-4 font-bold border-b border-gray-800">Size (IN)</th>
                        <th className="py-3.5 px-4 font-bold border-b border-gray-800 text-center">Bust</th>
                        <th className="py-3.5 px-4 font-bold border-b border-gray-800 text-center">Waist</th>
                        <th className="py-3.5 px-4 font-bold border-b border-gray-800 text-center">Hip</th>
                        <th className="py-3.5 px-4 font-bold border-b border-gray-800 text-center">Length</th>
                        <th className="py-3.5 px-4 font-bold border-b border-gray-800 text-center">Shoulder</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {SIZE_CHART_DATA.map((row, idx) => (
                        <tr
                          key={row.size}
                          className={`hover:bg-amber-50/60 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                        >
                          <td className="py-3.5 px-4 font-bold text-[var(--color-dark)] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-primary-gold)]"></span>
                            {row.size}
                          </td>
                          <td className="py-3.5 px-4 text-center font-semibold text-gray-800">{row.bust}</td>
                          <td className="py-3.5 px-4 text-center font-semibold text-gray-800">{row.waist}</td>
                          <td className="py-3.5 px-4 text-center font-semibold text-gray-800">{row.hip}</td>
                          <td className="py-3.5 px-4 text-center font-semibold text-gray-800">{row.length}</td>
                          <td className="py-3.5 px-4 text-center font-semibold text-gray-800">{row.shoulder}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Collapsible reference chart */}
                <details className="group bg-white rounded-2xl border border-gray-200 p-4">
                  <summary className="font-bold text-xs uppercase tracking-wider text-[var(--color-dark)] cursor-pointer flex items-center justify-between">
                    <span>View Uploaded Reference Image Chart</span>
                    <span className="text-[var(--color-primary-gold)] group-open:rotate-180 transition-transform font-bold">▼</span>
                  </summary>
                  <div className="mt-4 relative w-full h-[45vh] bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100">
                    <Image
                      src="/images/image.png"
                      alt="Reference Measurement Table"
                      fill
                      className="object-contain"
                    />
                  </div>
                </details>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-[var(--color-champagne)] flex items-center justify-between text-xs text-gray-500 font-sans">
                <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                  <Check size={14} className="text-emerald-600" /> Standard Indian Women Sizing (All measurements in Inches)
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeChartOpen(false)}
                  className="px-6 py-2.5 bg-[var(--color-dark)] text-white text-xs font-bold uppercase rounded-full hover:bg-black transition-all shadow-md cursor-pointer"
                >
                  Close Guide
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-warm-white)] flex items-center justify-center"><p className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary-gold)]">Loading YEZ BEE Catalog...</p></div>}>
      <CategoryPageContent />
    </Suspense>
  );
}
