'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Truck,
  Clock,
  MapPin,
  CreditCard,
  ShieldCheck,
  ImageIcon,
} from 'lucide-react';
import { api } from '@/lib/api';
import InvoiceDownloadDropdown from '@/components/admin/InvoiceDownloadDropdown';
import { InvoiceData } from '@/lib/invoiceExporter';
import { getSafeImageUrl } from '@/lib/utils';

interface OrderTimelineStage {
  label: string;
  key: string;
  description: string;
}

const STAGES: OrderTimelineStage[] = [
  { label: 'ORDER PLACED', key: 'placed', description: 'Order received at atelier' },
  { label: 'CONFIRMED', key: 'confirmed', description: 'Payment verified & order approved' },
  { label: 'PACKED', key: 'packed', description: 'Bespoke packaging & quality checked' },
  { label: 'SHIPPED', key: 'shipped', description: 'Handed over to BlueDart Express' },
  { label: 'OUT FOR DELIVERY', key: 'out_for_delivery', description: 'Agent out for doorstep delivery' },
  { label: 'DELIVERED', key: 'delivered', description: 'Package delivered safely' },
];

function getStageIndex(status: string): number {
  const s = (status || '').toLowerCase();
  switch (s) {
    case 'pending':
    case 'placed':
      return 0;
    case 'confirmed':
      return 1;
    case 'processing':
    case 'packed':
      return 2;
    case 'shipped':
      return 3;
    case 'out_for_delivery':
      return 4;
    case 'delivered':
      return 5;
    case 'cancelled':
      return 0;
    default:
      return 1;
  }
}

function formatDate(isoDate?: string): string {
  if (!isoDate) return 'Recent';
  try {
    return new Date(isoDate).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Recent';
  }
}

function getExpectedDelivery(isoDate?: string): string {
  try {
    const base = isoDate ? new Date(isoDate) : new Date();
    base.setDate(base.getDate() + 4);
    return base.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Within 4-5 business days';
  }
}

const MOCK_FALLBACK_ORDER = {
  orderNumber: '202612345',
  date: 'August 01, 2026',
  expectedDelivery: 'August 05, 2026',
  currentStageIndex: 3,
  courier: 'BlueDart Express Priority',
  trackingNumber: 'BD-987654321IN',
  status: 'shipped',
  statusText: 'In Transit - Dispatched and on schedule for doorstep delivery',
  totalAmount: 3798,
  paymentStatus: 'Paid via Razorpay Online Payment',
  paymentMethod: 'Razorpay',
  shippingAddress: {
    name: 'Priya Sharma',
    address1: '42, Rosewood Apartments, Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
    phone: '+91 98765 43210',
  },
  items: [
    {
      id: '1',
      name: 'Pure Chanderi Silk Zari Kurta Set',
      size: 'M',
      color: 'Royal Gold',
      quantity: 1,
      price: 2499,
      image: '/images/categories/maternity-kurtis.jpg',
    },
    {
      id: '2',
      name: 'Artisanal Cotton Feeding Gown',
      size: 'L',
      color: 'Pastel Blush',
      quantity: 1,
      price: 1299,
      image: '/images/maternity/slide3.jpg',
    },
  ],
};

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || searchParams.get('id') || '';

  const [orderId, setOrderId] = useState(initialOrderId);
  const [contactInfo, setContactInfo] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const performTrack = async (targetId: string, contact?: string) => {
    const cleanId = String(targetId || '').replace(/^#/, '').trim();
    if (!cleanId) {
      setErrorMsg('Please enter your Order ID');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    setSearched(true);

    try {
      const res = await api.getOrder(cleanId);
      if (res && res.success && res.data) {
        const o = res.data;
        const stageIndex = getStageIndex(o.status);

        const mappedItems = Array.isArray(o.items) && o.items.length > 0
          ? o.items.map((it: any, idx: number) => ({
              id: it.product || it.productId || String(idx + 1),
              name: it.name || 'Artisanal Fashion Item',
              size: it.size || it.meta?.size || '',
              color: it.color || it.meta?.color || '',
              quantity: Number(it.quantity) || 1,
              price: Number(it.price) || 0,
              image: it.image || '',
            }))
          : [
              {
                id: '1',
                name: 'Haute Atelier Collection Item',
                size: 'Free Size',
                color: 'Gold',
                quantity: 1,
                price: Number(o.totalAmount) || 0,
                image: '',
              },
            ];

        const mapped = {
          orderNumber: o.orderNumber || o.id || cleanId,
          date: formatDate(o.createdAt),
          createdAt: o.createdAt || new Date().toISOString(),
          expectedDelivery: getExpectedDelivery(o.createdAt),
          currentStageIndex: stageIndex,
          courier: 'BlueDart Express Priority',
          trackingNumber: `BD-${String(o.orderNumber || cleanId).slice(-6)}IN`,
          status: o.status || 'confirmed',
          statusText:
            stageIndex >= 5
              ? 'Delivered safely to doorstep.'
              : stageIndex >= 4
              ? 'Out for delivery today with courier partner.'
              : stageIndex >= 3
              ? 'Dispatched via BlueDart Express. In Transit.'
              : stageIndex >= 2
              ? 'Quality checked and securely packaged at atelier.'
              : 'Order confirmed and scheduled for packaging.',
          totalAmount: Number(o.totalAmount) || 0,
          paymentStatus:
            (o.payment || '').toLowerCase() === 'paid'
              ? `Paid (${o.paymentMethod || 'Online'})`
              : `Payment Pending (${o.paymentMethod || 'Cash on Delivery'})`,
          paymentMethod: o.paymentMethod || 'Online',
          shippingAddress: {
            name: o.shippingAddress ? `${o.shippingAddress.firstName} ${o.shippingAddress.lastName || ''}`.trim() : 'Valued Customer',
            address1: o.shippingAddress?.address1 || 'Shipping Address',
            city: o.shippingAddress?.city || '',
            state: o.shippingAddress?.state || '',
            pincode: o.shippingAddress?.pincode || '',
            phone: o.shippingAddress?.phone || '',
          },
          items: mappedItems,
        };

        setFoundOrder(mapped);
      } else if (cleanId === '202612345' || cleanId.toLowerCase() === 'demo') {
        // Fallback demo order for testing
        setFoundOrder(MOCK_FALLBACK_ORDER);
      } else {
        setFoundOrder(null);
      }
    } catch (err) {
      console.error('Tracking fetch error:', err);
      if (cleanId === '202612345') {
        setFoundOrder(MOCK_FALLBACK_ORDER);
      } else {
        setFoundOrder(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      setOrderId(initialOrderId);
      performTrack(initialOrderId);
    }
  }, [initialOrderId]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performTrack(orderId, contactInfo);
  };

  const invoiceData: InvoiceData | null = foundOrder
    ? {
        id: foundOrder.orderNumber,
        date: foundOrder.createdAt || new Date().toISOString(),
        status: foundOrder.status,
        payment: foundOrder.paymentStatus.includes('Paid') ? 'paid' : 'unpaid',
        paymentMethod: foundOrder.paymentMethod,
        subtotal: foundOrder.totalAmount,
        shipping: 0,
        discount: 0,
        tax: 0,
        total: foundOrder.totalAmount,
        customer: {
          name: foundOrder.shippingAddress.name,
          phone: foundOrder.shippingAddress.phone,
        },
        shippingAddress: {
          line1: foundOrder.shippingAddress.address1,
          city: foundOrder.shippingAddress.city,
          state: foundOrder.shippingAddress.state,
          pincode: foundOrder.shippingAddress.pincode,
          country: 'India',
        },
        items: foundOrder.items.map((it: any, idx: number) => ({
          id: idx + 1,
          name: it.name,
          size: it.size,
          color: it.color,
          price: it.price,
          quantity: it.quantity,
        })),
      }
    : null;

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-xs text-[var(--color-dark)]/50 font-medium" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--color-primary-gold)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--color-dark)] font-bold">Track Your Order</span>
        </nav>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-champagne)]/60 text-[var(--color-dark)] text-xs font-bold uppercase tracking-wider mb-4 border border-[var(--color-primary-gold)]/30">
          <Package size={14} className="text-[var(--color-primary-gold)]" /> Real-Time Live Order Tracking
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-bold text-[var(--color-dark)] mb-3">
          Track Your Order
        </h1>

        <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto mb-8 font-sans">
          Enter your Order ID (Order Number) below to view live parcel updates, courier status, and ordered size/item details.
        </p>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[var(--color-champagne)]/80 shadow-soft-md text-left">
          <form onSubmit={handleTrackSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="order-id-input" className="block text-xs font-bold uppercase tracking-wider text-[var(--color-dark)] mb-2">
                  Order ID / Number *
                </label>
                <input
                  id="order-id-input"
                  type="text"
                  placeholder="e.g. 2026849201"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-semibold rounded-xl border border-gray-200 outline-none focus:border-[var(--color-primary-gold)] bg-gray-50/50"
                  required
                />
              </div>

              <div>
                <label htmlFor="contact-info-input" className="block text-xs font-bold uppercase tracking-wider text-[var(--color-dark)] mb-2">
                  Phone Number or Email <span className="text-gray-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  id="contact-info-input"
                  type="text"
                  placeholder="e.g. 9876543210 or email@domain.com"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-semibold rounded-xl border border-gray-200 outline-none focus:border-[var(--color-primary-gold)] bg-gray-50/50"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs font-bold text-[var(--color-soft-red)] flex items-center gap-1.5">
                <AlertCircle size={14} /> {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[var(--color-dark)] text-white text-xs font-bold uppercase tracking-[0.18em] rounded-xl hover:bg-[var(--color-darker)] hover:shadow-dark-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search size={16} /> Track Order Status
                </>
              )}
            </button>
          </form>

          <p className="mt-3 text-[11px] text-gray-400 text-center">
            You can find your Order Number in your SMS, WhatsApp, or order confirmation email.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {searched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
          >
            {foundOrder ? (
              <div className="bg-white rounded-3xl border border-[var(--color-champagne)] p-6 sm:p-10 shadow-soft-lg space-y-8">
                {/* Header Card */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[var(--color-champagne)] gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary-gold)]">
                        Order #{foundOrder.orderNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                        {foundOrder.status}
                      </span>
                      <span className="text-xs text-gray-400">· Placed on {foundOrder.date}</span>
                    </div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--color-dark)]">
                      Expected Delivery: {foundOrder.expectedDelivery}
                    </h2>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    {invoiceData && (
                      <InvoiceDownloadDropdown order={invoiceData} buttonText="Download Invoice" buttonStyle="outline" />
                    )}
                    <div className="text-left sm:text-right text-xs text-gray-500">
                      <p className="font-semibold text-black">Courier: {foundOrder.courier}</p>
                      <p>AWB: <span className="font-mono font-bold text-[var(--color-dark)]">{foundOrder.trackingNumber}</span></p>
                    </div>
                  </div>
                </div>

                {/* Live Timeline */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[var(--color-dark)] flex items-center gap-2">
                      <Truck size={16} className="text-[var(--color-primary-gold)]" /> Live Shipment Timeline
                    </h3>
                    <span className="text-xs font-semibold text-[var(--color-primary-gold)]">
                      {foundOrder.statusText}
                    </span>
                  </div>

                  <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
                    <div className="hidden md:block absolute top-5 left-6 right-6 h-0.5 bg-gray-200 z-0" />
                    <div
                      className="hidden md:block absolute top-5 left-6 h-0.5 bg-[var(--color-primary-gold)] z-0 transition-all duration-500"
                      style={{ width: `${(foundOrder.currentStageIndex / (STAGES.length - 1)) * 100}%` }}
                    />

                    {STAGES.map((stage, index) => {
                      const isCompleted = index <= foundOrder.currentStageIndex;
                      const isCurrent = index === foundOrder.currentStageIndex;

                      return (
                        <div key={stage.key} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center flex-1">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                              isCurrent
                                ? 'bg-[var(--color-dark)] text-white ring-4 ring-[var(--color-primary-gold)]/50 scale-110 shadow-gold-sm'
                                : isCompleted
                                ? 'bg-[var(--color-primary-gold)] text-[var(--color-dark)]'
                                : 'bg-gray-100 text-gray-400 border border-gray-200'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 size={18} /> : index + 1}
                          </div>

                          <div>
                            <p className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-[var(--color-dark)]' : 'text-gray-400'}`}>
                              {stage.label}
                            </p>
                            <p className="text-[10px] text-gray-500 max-w-[120px]">
                              {stage.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items in this order */}
                <div>
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[var(--color-dark)] mb-4 flex items-center gap-2">
                    <Package size={16} className="text-[var(--color-primary-gold)]" /> Ordered Products ({foundOrder.items.length})
                  </h3>

                  <div className="space-y-3">
                    {foundOrder.items.map((it: any) => (
                      <div
                        key={it.id}
                        className="bg-[var(--color-warm-white)] p-4 sm:p-5 rounded-2xl border border-[var(--color-champagne)]/60 flex items-center gap-4"
                      >
                        <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0 flex items-center justify-center">
                          {getSafeImageUrl(it.image) ? (
                            <Image src={getSafeImageUrl(it.image)} alt={it.name} fill className="object-cover" />
                          ) : (
                            <ImageIcon size={24} className="text-gray-300" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-display font-bold text-sm text-[var(--color-dark)]">{it.name}</h4>
                            {it.size && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#FAF7F2] text-[#8C6D23] border border-[#E8DFC8]">
                                Size: {it.size}
                              </span>
                            )}
                            {it.color && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                Color: {it.color}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Qty: <span className="font-semibold text-black">{it.quantity}</span> · Price: <span className="font-semibold text-black">₹{it.price.toLocaleString('en-IN')}</span>
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="font-sans text-sm sm:text-base font-bold text-[var(--color-dark)]">
                            ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery and payment information summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--color-champagne)] text-xs">
                  <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[var(--color-champagne)]/40 space-y-1">
                    <p className="font-bold uppercase tracking-wider text-[var(--color-dark)] flex items-center gap-1.5 mb-1">
                      <MapPin size={13} className="text-[var(--color-primary-gold)]" /> Delivery Destination
                    </p>
                    <p className="font-semibold text-black">{foundOrder.shippingAddress.name}</p>
                    <p className="text-gray-600">{foundOrder.shippingAddress.address1}</p>
                    <p className="text-gray-600">{foundOrder.shippingAddress.city}, {foundOrder.shippingAddress.state} - {foundOrder.shippingAddress.pincode}</p>
                    {foundOrder.shippingAddress.phone && (
                      <p className="text-gray-600">Contact: {foundOrder.shippingAddress.phone}</p>
                    )}
                  </div>

                  <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[var(--color-champagne)]/40 space-y-1">
                    <p className="font-bold uppercase tracking-wider text-[var(--color-dark)] flex items-center gap-1.5 mb-1">
                      <CreditCard size={13} className="text-[var(--color-primary-gold)]" /> Payment Details
                    </p>
                    <p className="font-semibold text-emerald-700">{foundOrder.paymentStatus}</p>
                    <p className="text-gray-600">Total Billed: <strong className="text-black">₹{foundOrder.totalAmount.toLocaleString('en-IN')}</strong></p>
                    <p className="text-gray-500">Shipping: Free Express White Glove Delivery</p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-[var(--color-champagne)] p-8 text-center space-y-4 shadow-soft-md">
                <AlertCircle size={48} className="mx-auto text-[var(--color-soft-red)]" />
                <h3 className="font-display text-2xl font-bold text-[var(--color-dark)]">Order Not Found</h3>
                <p className="text-gray-600 text-sm max-w-md mx-auto">
                  We could not find an active order matching Order ID <span className="font-mono font-bold text-black">{orderId}</span>. Please verify the number from your receipt or confirmation email.
                </p>

                <div className="pt-4 flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => { setSearched(false); setOrderId(''); setContactInfo(''); }}
                    className="px-6 py-2.5 border border-gray-300 rounded-full text-xs font-bold uppercase tracking-wider hover:border-black transition-colors"
                  >
                    Try Again
                  </button>
                  <Link
                    href="/account/orders"
                    className="px-6 py-2.5 bg-gray-100 text-[var(--color-dark)] rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
                  >
                    View My Orders
                  </Link>
                  <Link
                    href="/contact"
                    className="px-6 py-2.5 bg-[var(--color-primary-gold)] text-[var(--color-dark)] rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[var(--color-gold-light)] flex items-center gap-1.5 transition-colors"
                  >
                    <HelpCircle size={14} /> Contact Support
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--color-warm-white)] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[var(--color-primary-gold)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
