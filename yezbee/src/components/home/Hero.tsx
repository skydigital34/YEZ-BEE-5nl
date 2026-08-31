'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, HeartHandshake } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const slides = [
  {
    id: 1,
    eyebrow: 'MATERNITY & FEEDING WEAR',
    heading: 'Yezbee Fashion - Best Maternity Kurtis for Women',
    description: 'Shop the best maternity kurtis and kurti sets for women online. Enjoy stylish, comfortable, and pregnancy-friendly designs perfect for every occasion.',
    mobileDescription: 'Shop stylish, comfortable & pregnancy-friendly maternity kurtis online.',
    primaryCta: 'SHOP MATERNITY KURTIS',
    primaryHref: '/category/ethnic-wear',
    secondaryCta: 'EXPLORE ALL KURTIS',
    secondaryHref: '/category/casuals',
    image: '/images/herohalf/slide1.png',
    alt: 'Best maternity kurtis and kurti sets for women online - YEZ BEE',
    align: 'left',
    imagePosition: 'object-cover object-[70%_0%]',
    imageContainerClass: 'w-full sm:w-1/2 lg:w-1/2',
    bg: '#B5B6B7',
    ambientGlow: 'radial-gradient(circle at 75% 50%, rgba(255, 235, 204, 0.45) 0%, rgba(212, 175, 55, 0.15) 35%, transparent 70%)',
    floatingBadge: {
      title: 'Concealed Feeding Zip',
      subtitle: '100% Ultra-Soft Cotton',
      rating: '4.9 ★★★★★',
    },
    features: ['Discrete 2-Way Zips', 'Bump-Friendly Fit', '100% Soft Cotton'],
  },
  {
    id: 2,
    eyebrow: 'PREGNANCY & MATERNITY WEAR',
    heading: 'Best Pregnancy Dresses for Women',
    description: 'Discover stylish, ultra-comfortable, and breathable pregnancy dresses designed to flatter your bump through every stage of motherhood.',
    mobileDescription: 'Discover stylish, comfortable pregnancy dresses for every stage.',
    primaryCta: 'SHOP PREGNANCY DRESSES',
    primaryHref: '/category/ethnic-wear',
    secondaryCta: 'SHOP FEEDING WEAR',
    secondaryHref: '/category/casuals/feeding',
    image: '/images/herohalf/image.png',
    alt: 'Best pregnancy dresses for women online - YEZ BEE',
    align: 'left',
    imagePosition: 'object-cover object-[70%_20%]',
    imageContainerClass: 'w-full sm:w-1/2 lg:w-1/2',
    bg: '#D8D4CF',
    ambientGlow: 'radial-gradient(circle at 75% 50%, rgba(255, 235, 204, 0.4) 0%, rgba(212, 175, 55, 0.12) 35%, transparent 70%)',
    floatingBadge: {
      title: 'Breathable Maternity Wear',
      subtitle: 'Ultra Comfortable silhouttes',
      rating: '4.9 ★★★★★',
    },
    features: ['Breathable Fabric', 'Flexible Bump Expansion', 'Seamless Comfort'],
  },
  {
    id: 3,
    eyebrow: 'VERSATILE COUTURE',
    heading: 'Feeding and Non Feeding Dress',
    description: 'Explore our signature collection of discrete zippable feeding dresses and non-feeding kurtis crafted for seamless transition, daily comfort, and effortless style.',
    mobileDescription: 'Explore discrete feeding dresses & versatile non-feeding kurtis.',
    primaryCta: 'SHOP FEEDING WEAR',
    primaryHref: '/category/casuals/feeding',
    secondaryCta: 'NON-FEEDING WEAR',
    secondaryHref: '/category/casuals/non-feeding',
    image: '/images/herohalf/image copy.png',
    alt: 'Feeding and non feeding dress online - YEZ BEE',
    align: 'right',
    imagePosition: 'object-cover object-[30%_20%]',
    imageContainerClass: 'w-full sm:w-1/2 lg:w-1/2',
    bg: '#CBB8A9',
    ambientGlow: 'radial-gradient(circle at 25% 50%, rgba(255, 235, 204, 0.4) 0%, rgba(212, 175, 55, 0.12) 35%, transparent 70%)',
    floatingBadge: {
      title: 'Feeding & Non-Feeding',
      subtitle: 'Versatile Daily Couture',
      rating: '4.8 ★★★★★',
    },
    features: ['Discrete Zippers', 'All-Day Wear', 'Stylish Silhouettes'],
  },
  {
    id: 4,
    eyebrow: 'EXCLUSIVE FESTIVE OFFER',
    heading: 'Flat 10% OFF On Entire Collection',
    description: 'Enjoy an exclusive flat 10% discount on all maternity kurtis, feeding dresses, and loungewear. Limited time offer — grab your favorites today!',
    mobileDescription: 'Get Flat 10% OFF on all maternity & feeding wear!',
    primaryCta: 'CLAIM 10% OFFER',
    primaryHref: '/category/all',
    secondaryCta: 'EXPLORE OFFER DEALS',
    secondaryHref: '/sale',
    image: '/images/herohalf/image copy 2.png',
    alt: 'Flat 10% OFF offer on YEZ BEE maternity and feeding dresses',
    align: 'right',
    imagePosition: 'object-cover object-[30%_20%]',
    imageContainerClass: 'w-full sm:w-1/2 lg:w-1/2',
    bg: '#DFD7CE',
    ambientGlow: 'radial-gradient(circle at 25% 50%, rgba(255, 235, 204, 0.4) 0%, rgba(212, 175, 55, 0.12) 35%, transparent 70%)',
    floatingBadge: {
      title: 'Exclusive Offer',
      subtitle: 'Flat 10% OFF Sitewide',
      rating: '5.0 ★★★★★',
    },
    features: ['Flat 10% OFF', 'Free Shipping', 'Easy Returns'],
  },
];

const textVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5500);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  const slide = slides[currentSlide];

  return (
    <section
      className="relative w-full h-[480px] sm:h-[560px] md:h-[650px] lg:h-[720px] overflow-hidden text-white transition-colors duration-700"
      style={{ backgroundColor: slide.bg }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Maternity Dress Campaign"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 z-0"
        >
          {/* Ambient radial glow for luxury depth */}
          {slide.ambientGlow && (
            <div
              className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-700"
              style={{ background: slide.ambientGlow }}
            />
          )}

          {/* Hero Slide Image container with seamless edge blending */}
          <div
            className={cn(
              'absolute inset-y-0 z-0 h-full',
              slide.imageContainerClass || 'w-full sm:w-1/2 lg:w-[58%]',
              slide.align === 'left' ? 'right-0' : 'left-0'
            )}
            style={{
              maskImage: slide.align === 'left'
                ? 'linear-gradient(to right, transparent 0%, black 25%, black 100%)'
                : 'linear-gradient(to left, transparent 0%, black 25%, black 100%)',
              WebkitMaskImage: slide.align === 'left'
                ? 'linear-gradient(to right, transparent 0%, black 25%, black 100%)'
                : 'linear-gradient(to left, transparent 0%, black 25%, black 100%)',
            }}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={slide.id === 1}
              className={cn(
                slide.imagePosition || 'object-cover',
                !slide.imagePosition && (slide.align === 'left' ? 'object-right-top' : 'object-left-top')
              )}
              sizes="(max-width: 640px) 100vw, 50vw"
            />

            {/* Floating Glassmorphic Badge */}
            {slide.floatingBadge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="absolute bottom-6 left-6 md:left-8 z-20 hidden md:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 shadow-2xl text-white pointer-events-auto"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--color-primary-gold)] to-[var(--color-gold-light)] flex items-center justify-center text-[var(--color-dark)] shrink-0 shadow-md font-bold text-xs">
                  ✨
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wide text-white drop-shadow-sm">{slide.floatingBadge.title}</p>
                  <p className="text-[11px] text-white/80 font-medium">{slide.floatingBadge.subtitle}</p>
                </div>
                <div className="ml-1 px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-[10px] font-bold text-[var(--color-gold-light)] border border-white/20">
                  {slide.floatingBadge.rating}
                </div>
              </motion.div>
            )}
          </div>

          <div
            className={cn(
              'absolute inset-0 z-10 pointer-events-none',
              slide.align === 'left'
                ? 'bg-gradient-to-r from-black/80 via-black/35 via-45% to-transparent'
                : 'bg-gradient-to-l from-black/80 via-black/35 via-45% to-transparent'
            )}
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/25 to-transparent sm:hidden pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-full flex items-center py-6 sm:py-8">
          <div
            className={cn(
              'w-full max-w-md sm:max-w-lg lg:max-w-xl z-20',
              slide.align === 'right'
                ? 'ml-auto text-left pr-2 sm:pr-4'
                : 'text-left pl-2 sm:pl-4 md:pl-6 lg:pl-8'
            )}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex flex-col items-start"
              >
                <motion.div custom={0} variants={textVariants} className="inline-flex items-center gap-2 mb-1.5 sm:mb-2">
                  <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-gold-light)] shadow-xs">
                    <Sparkles size={13} className="text-[var(--color-primary-gold)] animate-pulse" />
                    {slide.eyebrow}
                  </span>
                </motion.div>

                <motion.h1
                  custom={1}
                  variants={textVariants}
                  className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15] mb-2 sm:mb-3 drop-shadow-md"
                >
                  {slide.heading}
                </motion.h1>

                <motion.p
                  custom={2}
                  variants={textVariants}
                  className="text-xs sm:text-sm lg:text-base text-white/90 font-sans leading-relaxed mb-3 sm:mb-4 max-w-xl drop-shadow-sm"
                >
                  <span className="hidden sm:inline">{slide.description}</span>
                  <span className="sm:hidden">{slide.mobileDescription}</span>
                </motion.p>

                {/* Feature Tags for Slide 1 */}
                {slide.features && (
                  <motion.div custom={2.5} variants={textVariants} className="flex flex-wrap gap-2 mb-4">
                    {slide.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-semibold text-white/95 shadow-2xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-gold)]" />
                        {feat}
                      </span>
                    ))}
                  </motion.div>
                )}

                <motion.div custom={3} variants={textVariants} className="flex flex-wrap items-center gap-2.5 sm:gap-3.5">
                  <Link
                    href={slide.primaryHref}
                    className={cn(
                      'group inline-flex items-center gap-2 rounded-full px-5 sm:px-7 py-2.5 sm:py-3 text-xs font-bold uppercase tracking-[0.14em] transition-all duration-300 min-h-[38px] sm:min-h-[44px]',
                      'bg-gradient-to-r from-[var(--color-primary-gold)] to-[var(--color-gold-light)] text-[var(--color-dark)]',
                      'hover:shadow-[0_8px_25px_rgba(212,175,55,0.45)] hover:scale-105 active:scale-95'
                    )}
                  >
                    {slide.primaryCta}
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>

                  {slide.secondaryCta && (
                    <Link
                      href={slide.secondaryHref!}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full px-5 sm:px-7 py-2.5 sm:py-3 text-xs font-bold uppercase tracking-[0.14em] transition-all duration-300 min-h-[38px] sm:min-h-[44px]',
                        'border border-white/50 text-white backdrop-blur-sm bg-white/10 hover:bg-white hover:text-[var(--color-dark)] hover:border-white'
                      )}
                    >
                      {slide.secondaryCta}
                    </Link>
                  )}
                </motion.div>

                <motion.div custom={4} variants={textVariants} className="mt-4 sm:mt-5 pt-3 border-t border-white/20 flex items-center gap-2 text-xs text-white/80 font-medium">
                  <HeartHandshake size={14} className="text-[var(--color-primary-gold)] shrink-0" />
                  <span>Comfort-first silhouettes • Easy movement • Thoughtful fits</span>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={prevSlide}
        suppressHydrationWarning
        className="absolute left-2.5 sm:left-5 top-1/2 z-20 -translate-y-1/2 rounded-full p-2 sm:p-2.5 text-white/80 bg-black/30 backdrop-blur-md transition-all duration-300 hover:bg-white/25 hover:text-white cursor-pointer"
        aria-label="Previous maternity slide"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        suppressHydrationWarning
        className="absolute right-2.5 sm:right-5 top-1/2 z-20 -translate-y-1/2 rounded-full p-2 sm:p-2.5 text-white/80 bg-black/30 backdrop-blur-md transition-all duration-300 hover:bg-white/25 hover:text-white cursor-pointer"
        aria-label="Next maternity slide"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-3 sm:bottom-4 left-4 sm:left-8 z-20 flex items-center gap-3">
        <span className="font-mono text-[11px] sm:text-xs font-bold text-white/80 tracking-wider">
          0{currentSlide + 1} <span className="text-white/40">/</span> 0{slides.length}
        </span>
        <div className="flex items-center gap-1.5">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              suppressHydrationWarning
              className={cn(
                'h-1.5 rounded-full transition-all duration-300 cursor-pointer',
                currentSlide === idx
                  ? 'w-5 bg-[var(--color-primary-gold)]'
                  : 'w-1.5 bg-white/40 hover:bg-white/70'
              )}
              aria-label={`Go to slide ${idx + 1}`}
              aria-pressed={currentSlide === idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
