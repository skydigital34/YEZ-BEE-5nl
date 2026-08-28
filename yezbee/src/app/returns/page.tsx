import Link from 'next/link';
import { 
  RefreshCw, 
  PackageCheck, 
  MessageCircle, 
  Sparkles, 
  ArrowRight, 
  Video, 
  Phone, 
  Mail, 
  AlertTriangle 
} from 'lucide-react';

export const metadata = {
  title: 'Returns & Exchange | Preethiwear',
  description: 'Submit an exchange request for damaged, defective, or incorrect items within 3 days of delivery.',
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[var(--color-dark)]/50 font-medium mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--color-primary-gold)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--color-dark)] font-bold">Returns &amp; Exchange</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-champagne)]/60 text-[var(--color-dark)] text-xs font-bold uppercase tracking-wider mb-4 border border-[var(--color-primary-gold)]/30">
            <Sparkles size={14} className="text-[var(--color-primary-gold)]" /> Easy Exchange Process
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[var(--color-dark)] mb-4">
            Exchange Guidelines
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto font-sans leading-relaxed">
            Need an exchange for a defective, damaged, or wrong item? Submit your request within 3 days of delivery.
          </p>
        </div>

        {/* 3 Step Process */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-[var(--color-champagne)] shadow-soft-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[var(--color-champagne)]/60 text-[var(--color-dark)] font-bold font-display flex items-center justify-center text-lg mb-3">1</div>
            <h3 className="font-display font-bold text-base text-[var(--color-dark)] mb-1">Submit Request</h3>
            <p className="text-xs text-gray-500">Submit within 3 days with a continuous unboxing video.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[var(--color-champagne)] shadow-soft-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[var(--color-champagne)]/60 text-[var(--color-dark)] font-bold font-display flex items-center justify-center text-lg mb-3">2</div>
            <h3 className="font-display font-bold text-base text-[var(--color-dark)] mb-1">Reverse Pickup</h3>
            <p className="text-xs text-gray-500">Hand over the unwashed, tagged item on the scheduled pickup date.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[var(--color-champagne)] shadow-soft-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[var(--color-champagne)]/60 text-[var(--color-dark)] font-bold font-display flex items-center justify-center text-lg mb-3">3</div>
            <h3 className="font-display font-bold text-base text-[var(--color-dark)] mb-1">Quality Check &amp; Exchange</h3>
            <p className="text-xs text-gray-500">Item undergoes QC and your replacement is processed.</p>
          </div>
        </div>

        {/* Support & Portal Box */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[var(--color-champagne)] shadow-soft-sm text-gray-700 font-sans text-sm sm:text-base leading-relaxed space-y-6">
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-200/60">
            <Video size={20} className="text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-900">
              <strong>Mandatory Unpacking Video:</strong> An unedited continuous video of opening the parcel is required for all defect or damage exchange claims.
            </div>
          </div>

          <h2 className="font-display text-xl font-bold text-[var(--color-dark)]">Customer Care &amp; Portal</h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Office Hours: Monday to Saturday (10:00 AM – 1:00 PM &amp; 2:00 PM – 6:00 PM)
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="https://preethiwear.in/apps/return_prime"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-primary-gold)] text-[var(--color-dark)] text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-sm"
            >
              Exchange Request Portal <ArrowRight size={14} />
            </a>
            <a
              href="https://wa.me/919056656698?text=Hi%20Preethiwear%2C%20I%20would%20like%20to%20request%20an%20exchange"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all"
            >
              <MessageCircle size={16} /> WhatsApp: 9056656698
            </a>
            <a
              href="tel:7418325657"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-dark)] text-white text-xs font-bold uppercase tracking-wider hover:bg-[var(--color-primary-gold)] hover:text-[var(--color-dark)] transition-all"
            >
              <Phone size={14} /> Call: 7418325657
            </a>
          </div>
        </div>

        {/* Back Link */}
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
