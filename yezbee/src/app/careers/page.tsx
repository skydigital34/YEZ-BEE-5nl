import Link from 'next/link';
import { Sparkles, Mail, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Careers | YEZ BEE Fashion',
  description: 'Join the YEZ BEE Fashion team. Explore career opportunities in design, marketing, and client care.',
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-[var(--color-dark)]/50 font-medium mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--color-primary-gold)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--color-dark)] font-bold">Careers</span>
        </nav>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-champagne)]/60 text-[var(--color-dark)] text-xs font-bold uppercase tracking-wider mb-4 border border-[var(--color-primary-gold)]/30">
            <Sparkles size={14} className="text-[var(--color-primary-gold)]" /> Work With Us
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[var(--color-dark)] mb-4">
            Join The YEZ BEE Team
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto font-sans leading-relaxed">
            We are always looking for passionate designers, fashion stylists, and customer experience champions.
          </p>
        </div>

        <div className="space-y-6 mb-12">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[var(--color-champagne)] shadow-soft-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary-gold)]">Design &amp; Production</span>
              <h3 className="font-display text-lg font-bold text-[var(--color-dark)]">Apparel &amp; Fashion Designer</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin size={12} /> Coimbatore / Tirupur, Tamil Nadu &bull; Full-time</p>
            </div>
            <a
              href="mailto:careers@yezbee.com?subject=Application:%20Fashion%20Designer"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[var(--color-dark)] text-white text-xs font-bold uppercase tracking-wider hover:bg-[var(--color-primary-gold)] hover:text-[var(--color-dark)] transition-all"
            >
              Apply Now
            </a>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[var(--color-champagne)] shadow-soft-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary-gold)]">Client Experience</span>
              <h3 className="font-display text-lg font-bold text-[var(--color-dark)]">Client Care &amp; WhatsApp Specialist</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin size={12} /> Remote / Hybrid &bull; Full-time</p>
            </div>
            <a
              href="mailto:careers@yezbee.com?subject=Application:%20Client%20Care"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[var(--color-dark)] text-white text-xs font-bold uppercase tracking-wider hover:bg-[var(--color-primary-gold)] hover:text-[var(--color-dark)] transition-all"
            >
              Apply Now
            </a>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[var(--color-champagne)] shadow-soft-sm text-center">
          <h3 className="font-display text-lg font-bold text-[var(--color-dark)] mb-2">Don&apos;t see your exact role?</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">Send your resume and portfolio directly to our talent acquisition team.</p>
          <a
            href="mailto:careers@yezbee.com"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--color-champagne)]/60 text-[var(--color-dark)] text-xs font-bold uppercase tracking-wider border border-[var(--color-primary-gold)]/40 hover:bg-[var(--color-primary-gold)] hover:text-[var(--color-dark)] transition-all"
          >
            <Mail size={15} /> Send Resume to careers@yezbee.com
          </a>
        </div>
      </div>
    </div>
  );
}
