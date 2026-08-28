import Link from 'next/link';
import { 
  Truck, 
  Clock, 
  Sparkles, 
  Globe, 
  CreditCard, 
  PackageCheck, 
  Phone, 
  MessageCircle, 
  Mail, 
  AlertTriangle, 
  MapPin, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';

export const metadata = {
  title: 'Shipping Policy | Preethiwear',
  description: 'Learn about Preethiwear’s dispatch timelines, courier partners, International Shipping, COD, and Pre-Order delivery policies.',
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[var(--color-dark)]/50 font-medium mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--color-primary-gold)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--color-dark)] font-bold">Shipping Policy</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-champagne)]/60 text-[var(--color-dark)] text-xs font-bold uppercase tracking-wider mb-4 border border-[var(--color-primary-gold)]/30">
            <Sparkles size={14} className="text-[var(--color-primary-gold)]" /> Delivery Guidelines
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[var(--color-dark)] mb-4">
            Shipping Policy
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto font-sans leading-relaxed">
            Fast, reliable, and transparent delivery across India and worldwide.
          </p>
        </div>

        <div className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-[var(--color-champagne)] shadow-soft-sm text-gray-700 font-sans text-sm sm:text-base leading-relaxed">
          
          {/* Office Hours & Customer Care */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5 text-[var(--color-dark)]">
              <Clock className="text-[var(--color-primary-gold)] shrink-0" size={22} />
              <h2 className="font-display text-xl font-bold">Office Hours &amp; Customer Care</h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--color-champagne)]/20 rounded-2xl border border-[var(--color-primary-gold)]/20 space-y-1.5">
                <h3 className="font-bold text-[var(--color-dark)] text-sm">Working Hours</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  <strong>Monday to Saturday</strong><br />
                  10:00 AM to 1:00 PM and 2:00 PM to 6:00 PM
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <h3 className="font-bold text-[var(--color-dark)] text-sm">Customer Care Contacts</h3>
                <div className="space-y-1 text-xs sm:text-sm text-gray-600">
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
                We assist you during our working hours. If we receive any calls during non-working hours, we will revert back on the next working day or request you to call during working hours. Please WhatsApp us only on <strong>9056656698</strong>.
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Dispatch & Delivery Timelines */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5 text-[var(--color-dark)]">
              <Truck className="text-[var(--color-primary-gold)] shrink-0" size={22} />
              <h2 className="font-display text-xl font-bold">Dispatch &amp; Delivery Timelines</h2>
            </div>
            
            <p className="text-sm">
              All orders will be dispatched within <strong>12 hours to 3 working days</strong> of order placement, except for Pre-order dresses (dispatched as per product timeline).
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Tamil Nadu</span>
                <span className="font-display text-lg font-bold text-[var(--color-dark)]">1 – 3 Days</span>
              </div>
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">South India</span>
                <span className="font-display text-lg font-bold text-[var(--color-dark)]">2 – 5 Days</span>
              </div>
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">North India</span>
                <span className="font-display text-lg font-bold text-[var(--color-dark)]">5 – 8 Days</span>
              </div>
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Border / Special</span>
                <span className="font-display text-lg font-bold text-[var(--color-dark)]">4 – 15 Days</span>
              </div>
            </div>

            {/* Express Dispatch Box */}
            <div className="p-4 bg-[var(--color-champagne)]/30 rounded-2xl border border-[var(--color-primary-gold)]/30 space-y-2">
              <div className="flex items-center gap-2 text-[var(--color-dark)] font-bold text-sm">
                <Zap size={16} className="text-[var(--color-primary-gold)]" /> Express Dispatch &amp; Delivery:
              </div>
              <p className="text-xs sm:text-sm text-gray-700">
                Mention <strong>&ldquo;URGENT&rdquo;</strong> in your order notes. Dispatch will be done on the same day if ordered before 3:00 PM, or next working day. Also call our customer care during working hours. Additional express shipping charges apply and must be informed prior to dispatch.
              </p>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Courier Partners & Tracking */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5 text-[var(--color-dark)]">
              <PackageCheck className="text-[var(--color-primary-gold)] shrink-0" size={22} />
              <h2 className="font-display text-xl font-bold">Courier Partners &amp; Tracking</h2>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-600">We usually ship orders through the following trusted delivery partners:</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--color-champagne)]/40 text-[var(--color-dark)] font-bold">
                    <th className="p-3 border border-[var(--color-champagne)]">Region</th>
                    <th className="p-3 border border-[var(--color-champagne)]">Primary Courier Partner</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2.5 font-semibold border border-gray-100">Tamil Nadu</td>
                    <td className="p-2.5 border border-gray-100">Franch Express</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="p-2.5 font-semibold border border-gray-100">Kerala</td>
                    <td className="p-2.5 border border-gray-100">Delhivery</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold border border-gray-100">Karnataka / Andhra Pradesh / Telangana</td>
                    <td className="p-2.5 border border-gray-100">DTDC / Delhivery (based on pincode serviceability)</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="p-2.5 font-semibold border border-gray-100">North India</td>
                    <td className="p-2.5 border border-gray-100">Delhivery</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs sm:text-sm text-gray-600">
              * On special request, we can ship through any courier company of your choice (please write in your order notes before checkout). Tracking details are sent to your Email &amp; WhatsApp within roughly 2 hours of dispatch.
            </p>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs sm:text-sm text-gray-600">
              <strong>Stock Availability:</strong> If any size or color is out of stock upon order confirmation, we will inform you within 1 – 5 working days with similar color/print suggestions or restock status before dispatch.
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Third-Party Service, RTO & Lost Parcels */}
          <section className="space-y-3">
            <h3 className="font-display text-lg font-bold text-[var(--color-dark)]">RTO &amp; Undelivered Parcels</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600 pl-2">
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary-gold)] font-bold">&bull;</span>
                <span><strong>RTO (Wrong/Insufficient Address or Number):</strong> If a parcel returns to our warehouse due to wrong address or unreachable phone number, we bear the return courier charges, but request the customer to pay courier charges for re-sending the parcel.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary-gold)] font-bold">&bull;</span>
                <span><strong>Lost Parcels:</strong> In any case if a parcel is lost by the courier partner, please do not panic — we will send you a new replacement parcel ASAP after an initial investigation. Refund is not applicable.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary-gold)] font-bold">&bull;</span>
                <span><strong>Third-Party Service:</strong> Public holidays, natural calamities, or strikes may cause unexpected transit delays. We will actively assist you in tracking down your package.</span>
              </li>
            </ul>
          </section>

          <hr className="border-gray-100" />

          {/* INTERNATIONAL SHIPPING */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[var(--color-dark)]">
              <Globe className="text-[var(--color-primary-gold)] shrink-0" size={22} />
              <h2 className="font-display text-xl font-bold">International Shipping Policy</h2>
            </div>
            <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-gray-600">
              <li>Orders will be dispatched within <strong>1 – 4 working days</strong>.</li>
              <li>We partner with <strong>DHL, India Post, Aramex, DTDC International, and Garudavega</strong>.</li>
              <li>We will share the shipping rates and estimated timelines offered by different international partners so you can choose your preferred carrier. Tracking numbers are sent immediately upon dispatch.</li>
              <li>If international shipping rates are not convenient, you can provide an Indian address and we will happily ship there.</li>
            </ul>
          </section>

          <hr className="border-gray-100" />

          {/* CASH ON DELIVERY (COD) */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[var(--color-dark)]">
              <CreditCard className="text-[var(--color-primary-gold)] shrink-0" size={22} />
              <h2 className="font-display text-xl font-bold">Cash On Delivery (COD)</h2>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-gray-600 pl-2">
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary-gold)] font-bold">&bull;</span>
                <span>All COD orders are confirmed over phone before dispatch. Calls are recorded for quality control.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary-gold)] font-bold">&bull;</span>
                <span>For order values exceeding <strong>₹3,000/-</strong>, we collect a <strong>₹200/-</strong> advance via Google Pay (9056656698). No advance is collected for orders below ₹3,000/-.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary-gold)] font-bold">&bull;</span>
                <span>For COD orders requiring zip customization, a ₹200 advance payment is required.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary-gold)] font-bold">&bull;</span>
                <span>If customer does not attend confirmation calls (after 2–4 attempts), we reserve the right to cancel the order.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary-gold)] font-bold">&bull;</span>
                <span>If a COD parcel encounters RTO, ₹150 courier charge is collected via GPay to reinitiate delivery.</span>
              </li>
            </ul>
          </section>

          <hr className="border-gray-100" />

          {/* PRE-ORDER DRESSES */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[var(--color-dark)]">
              <Sparkles className="text-[var(--color-primary-gold)] shrink-0" size={22} />
              <h2 className="font-display text-xl font-bold">Pre-Order Dresses</h2>
            </div>
            <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-gray-600">
              <li>All dresses with the pre-order tag will be shipped by the timeline mentioned in the product description.</li>
              <li>Pre-order dresses cannot be cancelled because they are stitched on demand.</li>
              <li>If an order contains both Pre-order and Ready-to-dispatch items, ready items can be shipped first for an extra ₹90 courier fee.</li>
              <li>Pre-order dresses are not eligible for standard COD and must be prepaid.</li>
            </ul>
          </section>

          <hr className="border-gray-100" />

          {/* PARTIAL COD */}
          <section className="space-y-3">
            <h3 className="font-display text-lg font-bold text-[var(--color-dark)]">Partial COD</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              We accept Partial COD orders by collecting <strong>₹150/- in advance</strong> (courier charges + COD booking fee) and the rest in cash on delivery upon customer confirmation over phone.
            </p>
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-600 space-y-1">
              <p><strong>Non-Refundable Advance:</strong> If you choose to cancel a Partial COD order or reject delivery at the doorstep, the ₹150 advance amount is non-refundable (as it covers two-way transit costs).</p>
              <p><strong>Alternative Options:</strong> (1) Pay ₹90 courier charges prepaid and the product cost on COD, or (2) Pay the total order value prepaid to avoid all extra charges.</p>
            </div>
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
