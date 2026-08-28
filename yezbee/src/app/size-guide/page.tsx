import Link from 'next/link';
import { Ruler, Sparkles, HeartHandshake } from 'lucide-react';

export const metadata = {
  title: 'Size Guide & Fit Chart | YEZ BEE Fashion',
  description: 'Find your perfect fit for maternity kurtis, feeding tops, loungewear, and kids clothing.',
};

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-[var(--color-dark)]/50 font-medium mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--color-primary-gold)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--color-dark)] font-bold">Size Guide</span>
        </nav>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-champagne)]/60 text-[var(--color-dark)] text-xs font-bold uppercase tracking-wider mb-4 border border-[var(--color-primary-gold)]/30">
            <Sparkles size={14} className="text-[var(--color-primary-gold)]" /> Accurate Measurements
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[var(--color-dark)] mb-4">
            Size &amp; Fit Guide
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto font-sans leading-relaxed">
            Our maternity and feeding wear are specially patterned to provide comfort across all stages of pregnancy and postpartum nursing.
          </p>
        </div>

        <div className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-[var(--color-champagne)] shadow-soft-sm">
          <div>
            <h2 className="font-display text-xl font-bold text-[var(--color-dark)] mb-4 flex items-center gap-2">
              <Ruler className="text-[var(--color-primary-gold)]" size={20} /> Women&apos;s Kurtis &amp; Loungewear Size Chart (Inches)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--color-champagne)]/50 text-[var(--color-dark)] font-bold">
                    <th className="p-3 border border-[var(--color-champagne)]">Size</th>
                    <th className="p-3 border border-[var(--color-champagne)]">Bust (Inches)</th>
                    <th className="p-3 border border-[var(--color-champagne)]">Waist (Inches)</th>
                    <th className="p-3 border border-[var(--color-champagne)]">Hip (Inches)</th>
                    <th className="p-3 border border-[var(--color-champagne)]">Length (Inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 font-bold border border-gray-100">S</td>
                    <td className="p-3 border border-gray-100">36</td>
                    <td className="p-3 border border-gray-100">34</td>
                    <td className="p-3 border border-gray-100">40</td>
                    <td className="p-3 border border-gray-100">44 - 46</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="p-3 font-bold border border-gray-100">M</td>
                    <td className="p-3 border border-gray-100">38</td>
                    <td className="p-3 border border-gray-100">36</td>
                    <td className="p-3 border border-gray-100">42</td>
                    <td className="p-3 border border-gray-100">44 - 46</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold border border-gray-100">L</td>
                    <td className="p-3 border border-gray-100">40</td>
                    <td className="p-3 border border-gray-100">38</td>
                    <td className="p-3 border border-gray-100">44</td>
                    <td className="p-3 border border-gray-100">44 - 46</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="p-3 font-bold border border-gray-100">XL</td>
                    <td className="p-3 border border-gray-100">42</td>
                    <td className="p-3 border border-gray-100">40</td>
                    <td className="p-3 border border-gray-100">46</td>
                    <td className="p-3 border border-gray-100">44 - 46</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold border border-gray-100">XXL</td>
                    <td className="p-3 border border-gray-100">44</td>
                    <td className="p-3 border border-gray-100">42</td>
                    <td className="p-3 border border-gray-100">48</td>
                    <td className="p-3 border border-gray-100">44 - 46</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="p-3 font-bold border border-gray-100">3XL</td>
                    <td className="p-3 border border-gray-100">46</td>
                    <td className="p-3 border border-gray-100">44</td>
                    <td className="p-3 border border-gray-100">50</td>
                    <td className="p-3 border border-gray-100">44 - 46</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-[var(--color-champagne)]/30 rounded-2xl border border-[var(--color-primary-gold)]/20 text-xs sm:text-sm text-gray-700 space-y-1.5">
            <div className="font-bold text-[var(--color-dark)] flex items-center gap-1.5">
              <HeartHandshake size={16} className="text-[var(--color-primary-gold)]" /> Maternity Sizing Tip:
            </div>
            <p>Our maternity wear includes extra room around the belly. We recommend choosing your current bust size for the best fit throughout your pregnancy.</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--color-dark)] text-white text-xs font-bold uppercase tracking-wider hover:bg-[var(--color-primary-gold)] hover:text-[var(--color-dark)] transition-all"
          >
            &larr; Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
