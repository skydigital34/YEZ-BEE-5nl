import Link from 'next/link';
import { 
  RefreshCw, 
  Clock, 
  Sparkles, 
  Truck, 
  ShieldAlert, 
  Video, 
  Phone, 
  Mail, 
  MessageCircle, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

export const metadata = {
  title: 'Refund & Return Policy | Preethiwear',
  description: 'Review the exchange guidelines, return eligibility, and customer support hours for Preethiwear.',
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[var(--color-dark)]/50 font-medium mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--color-primary-gold)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--color-dark)] font-bold">Refund &amp; Return Policy</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-champagne)]/60 text-[var(--color-dark)] text-xs font-bold uppercase tracking-wider mb-4 border border-[var(--color-primary-gold)]/30">
            <Sparkles size={14} className="text-[var(--color-primary-gold)]" /> Exchange Policy
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[var(--color-dark)] mb-4">
            Refund &amp; Return Policy
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto font-sans leading-relaxed">
            At Preethiwear, we prioritize customer satisfaction and aim to provide a smooth exchange process. We do not provide cash refunds. Please review the guidelines below:
          </p>
        </div>

        <div className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-[var(--color-champagne)] shadow-soft-sm text-gray-700 font-sans text-sm sm:text-base leading-relaxed">
          
          {/* Customer Support Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5 text-[var(--color-dark)]">
              <Clock className="text-[var(--color-primary-gold)] shrink-0" size={22} />
              <h2 className="font-display text-xl font-bold">Customer Support</h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--color-champagne)]/20 rounded-2xl border border-[var(--color-primary-gold)]/20 space-y-2">
                <h3 className="font-bold text-[var(--color-dark)] text-sm">Office Hours</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  <strong>Monday to Saturday</strong><br />
                  10:00 AM to 1:00 PM and 2:00 PM to 6:00 PM
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <h3 className="font-bold text-[var(--color-dark)] text-sm">Customer Care Contacts</h3>
                <div className="space-y-1.5 text-xs sm:text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="text-[var(--color-primary-gold)]" />
                    <span>Calls: <a href="tel:7418325657" className="font-semibold text-[var(--color-dark)] hover:underline">7418325657</a></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MessageCircle size={14} className="text-emerald-600" />
                    <span>WhatsApp: <a href="https://wa.me/919056656698" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--color-dark)] hover:underline">9056656698</a></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail size={14} className="text-[var(--color-primary-gold)]" />
                    <span>Email: <a href="mailto:support@preethiwear.in" className="font-semibold text-[var(--color-dark)] hover:underline">support@preethiwear.in</a></span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-600" />
              <div>
                <strong>Note:</strong> Queries received outside working hours will be addressed on the next working day. WhatsApp queries should only be sent to <strong>9056656698</strong>.
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Return Policy Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5 text-[var(--color-dark)]">
              <RefreshCw className="text-[var(--color-primary-gold)] shrink-0" size={22} />
              <h2 className="font-display text-xl font-bold">Return Policy</h2>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-base font-bold text-[var(--color-dark)]">Eligibility for Returns:</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600">
                <li>Returns are accepted only for items that are damaged, defective, or wrongly delivered.</li>
                <li>
                  Exchange requests must be submitted within <strong>3 days</strong> of delivery via{' '}
                  <a
                    href="https://preethiwear.in/apps/return_prime"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-primary-gold)] font-semibold underline hover:text-[var(--color-dark)]"
                  >
                    https://preethiwear.in/apps/return_prime
                  </a>.
                </li>
              </ul>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="font-display text-base font-bold text-[var(--color-dark)]">Conditions for Exchange:</h3>
              <div className="space-y-2.5 text-sm text-gray-600">
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Items must be unused, unwashed, and returned in their original condition with tags intact.</span>
                </div>
                <div className="flex items-start gap-2 p-3 bg-amber-50/60 rounded-xl border border-amber-200/50">
                  <Video size={16} className="text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>An unpacking video is mandatory</strong> for exchange requests related to damages, defects, or missing items. The video must be continuous, with no edits or cuts.
                  </span>
                </div>
              </div>
            </div>

            {/* Non-Returnable Items */}
            <div className="space-y-2 pt-2">
              <h3 className="font-display text-base font-bold text-[var(--color-dark)]">Non-Returnable Items:</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <XCircle size={15} className="text-red-500 shrink-0" />
                  <span>Products that have been used or washed.</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <XCircle size={15} className="text-red-500 shrink-0" />
                  <span>Items returned without an unpacking video as proof for damaged or missing claims.</span>
                </div>
              </div>
            </div>

            {/* Reverse Pickup */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-[var(--color-dark)]">
                <Truck size={18} className="text-[var(--color-primary-gold)]" />
                <h3 className="font-display text-base font-bold">Reverse Pickup:</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                We will arrange a reverse pickup. The customer must hand over the parcel on the scheduled date. Failing to return the parcel on the mentioned date will require the customer to manually return the item at their own cost.
              </p>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Refund Policy Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[var(--color-dark)]">
              <ShieldAlert className="text-red-600 shrink-0" size={22} />
              <h2 className="font-display text-xl font-bold">Refund Policy</h2>
            </div>
            
            <div className="p-4 bg-red-50/60 rounded-2xl border border-red-200/60 space-y-2">
              <h3 className="font-bold text-red-900 text-sm">No Refunds Provided</h3>
              <p className="text-xs sm:text-sm text-red-800 leading-relaxed">
                We do not offer cash refunds, bank refunds, or refunds in any other form for any product. Only an exchange will be provided if the conditions of the Exchange Policy are met.
              </p>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Important Notes */}
          <section className="space-y-3">
            <h3 className="font-display text-lg font-bold text-[var(--color-dark)]">Important Notes</h3>
            <p className="text-xs sm:text-sm text-gray-600">Items returned must pass a quality check. This includes:</p>
            <ul className="list-disc pl-6 space-y-1 text-xs sm:text-sm text-gray-600">
              <li>Product being in unused and unwashed condition.</li>
              <li>Tags being intact and no odors present.</li>
              <li>The Exchange process may take <strong>12 - 15 business days</strong> from the date of return approval.</li>
            </ul>
            <p className="text-xs sm:text-sm text-gray-600 pt-2">
              For any further clarifications, feel free to reach us at{' '}
              <a href="mailto:support@preethiwear.in" className="text-[var(--color-primary-gold)] font-semibold underline">
                support@preethiwear.in
              </a>.
            </p>
          </section>
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
