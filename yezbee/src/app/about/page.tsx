import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Heart, CheckCircle2, ArrowRight, Video, Mail, Instagram } from 'lucide-react';

export const metadata = {
  title: 'About Us | Preethi Wear',
  description: 'Welcome to Preethi Wear: Embracing Comfort During Your Journey. Stylish and comfortable maternity clothing solutions.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-[var(--color-dark)]/50 font-medium mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--color-primary-gold)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--color-dark)] font-bold">About Us</span>
        </nav>

        {/* Hero Banner */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-champagne)]/60 text-[var(--color-dark)] text-xs font-bold uppercase tracking-wider mb-4 border border-[var(--color-primary-gold)]/30">
            <Heart size={14} className="text-[var(--color-primary-gold)]" /> Embracing Comfort During Your Journey
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[var(--color-dark)] mb-4">
            Welcome to Preethi Wear
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto font-sans leading-relaxed">
            Where we specialize in creating stylish and comfortable clothing solutions for expecting mothers. Our mission is to support you through every stage of your journey, ensuring you feel relaxed, confident, and beautiful.
          </p>
        </div>

        {/* Vision & Commitment Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-5 relative aspect-[4/5] rounded-3xl overflow-hidden shadow-soft-lg border border-[var(--color-champagne)]">
            <Image
              src="/images/about/about-main.png"
              alt="Preethi Wear Maternity"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
          <div className="lg:col-span-7 space-y-6 text-gray-700 font-sans text-sm sm:text-base leading-relaxed">
            <div className="p-6 bg-white rounded-3xl border border-[var(--color-champagne)] shadow-soft-sm space-y-3">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--color-dark)]">
                Our Vision
              </h2>
              <p className="text-gray-600 text-sm">
                At Preethi Wear, we understand the importance of comfort during pregnancy and beyond. Our vision is to redefine maternity wear by offering high-quality loungewear that adapts to your changing body and lifestyle needs.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-[var(--color-champagne)] shadow-soft-sm space-y-4">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--color-dark)]">
                Our Commitment
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-[var(--color-primary-gold)] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[var(--color-dark)]">1. Comfort without Compromise:</strong> We prioritize comfort in every design, using soft, breathable fabrics that provide gentle support and freedom of movement.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-[var(--color-primary-gold)] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[var(--color-dark)]">2. Stylish Designs:</strong> Our loungewear combines practicality with style, allowing you to feel fashionable and confident whether you&apos;re at home or out and about.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-[var(--color-primary-gold)] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[var(--color-dark)]">3. Thoughtful Details:</strong> From Feeding flap for easy nursing access, our designs are crafted with thoughtful details to enhance your comfort and convenience.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Behind the Scenes */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[var(--color-champagne)] shadow-soft-sm mb-16 space-y-6">
          <div className="flex items-center gap-2.5 text-[var(--color-dark)]">
            <Video className="text-[var(--color-primary-gold)] shrink-0" size={24} />
            <h2 className="font-display text-2xl font-bold">Behind the Scenes</h2>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            Curious about how our maternity loungewear is crafted? Take a glimpse behind the scenes with our Instagram reels:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 bg-[var(--color-champagne)]/30 rounded-2xl border border-[var(--color-primary-gold)]/20 space-y-1.5">
              <span className="text-xs font-bold text-[var(--color-primary-gold)] uppercase tracking-wider">Step 1</span>
              <h3 className="font-display font-bold text-sm text-[var(--color-dark)]">Craftsmanship in Action</h3>
              <p className="text-xs text-gray-600">See firsthand the care and precision that goes into creating each piece of our maternity loungewear.</p>
            </div>
            <div className="p-4 bg-[var(--color-champagne)]/30 rounded-2xl border border-[var(--color-primary-gold)]/20 space-y-1.5">
              <span className="text-xs font-bold text-[var(--color-primary-gold)] uppercase tracking-wider">Step 2</span>
              <h3 className="font-display font-bold text-sm text-[var(--color-dark)]">Fabric Selection</h3>
              <p className="text-xs text-gray-600">Learn about the fabrics we select to ensure comfort and durability throughout your pregnancy journey.</p>
            </div>
            <div className="p-4 bg-[var(--color-champagne)]/30 rounded-2xl border border-[var(--color-primary-gold)]/20 space-y-1.5">
              <span className="text-xs font-bold text-[var(--color-primary-gold)] uppercase tracking-wider">Step 3</span>
              <h3 className="font-display font-bold text-sm text-[var(--color-dark)]">Customer Stories</h3>
              <p className="text-xs text-gray-600">Hear inspiring stories from expecting mothers who have experienced comfort and style with Preethi Maternity Loungewear.</p>
            </div>
            <div className="p-4 bg-[var(--color-champagne)]/30 rounded-2xl border border-[var(--color-primary-gold)]/20 space-y-1.5">
              <span className="text-xs font-bold text-[var(--color-primary-gold)] uppercase tracking-wider">Step 4</span>
              <h3 className="font-display font-bold text-sm text-[var(--color-dark)]">Our Team</h3>
              <p className="text-xs text-gray-600">Meet the passionate individuals behind Preethi Maternity Loungewear and discover what drives us to create exceptional products for you.</p>
            </div>
          </div>
        </div>

        {/* Empowering text */}
        <div className="bg-[var(--color-champagne)]/40 p-6 sm:p-8 rounded-3xl border border-[var(--color-primary-gold)]/30 text-center mb-12">
          <p className="text-sm sm:text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Choosing <strong>Preethi Wear</strong> means choosing comfort, style, and support during one of life&apos;s most precious journeys. We are dedicated to providing you with clothing that makes you feel good inside and out, empowering you to embrace this special time in your life.
          </p>
        </div>

        {/* Connect With Us */}
        <div className="bg-[var(--color-dark)] text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <h3 className="font-display text-xl font-bold text-[var(--color-primary-gold)] mb-1">Connect With Us</h3>
            <p className="text-xs sm:text-sm text-white/70">
              Experience the difference with Preethi Wear. Explore our collection today and discover the perfect blend of comfort and style.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="mailto:support@preethiwear.in"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-xs font-semibold hover:bg-white/20 transition-all text-white border border-white/20"
            >
              <Mail size={15} /> support@preethiwear.in
            </a>
            <a
              href="https://instagram.com/preethi.shapewear.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-primary-gold)] text-[var(--color-dark)] text-xs font-bold hover:brightness-110 transition-all"
            >
              <Instagram size={15} /> @preethi.shapewear.in
            </a>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/category/casuals"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--color-dark)] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[var(--color-primary-gold)] hover:text-[var(--color-dark)] transition-all shadow-md"
          >
            Explore Collection <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
