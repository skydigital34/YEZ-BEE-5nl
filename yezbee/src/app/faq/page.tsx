'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Sparkles, MessageCircle, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    category: 'Feeding & Maternity Wear',
    items: [
      {
        q: 'How do the feeding zippers work on your kurtis?',
        a: 'Our feeding wear is designed with discreet concealed vertical side zippers on both sides. They are soft against sensitive skin, completely invisible when zipped, and allow easy, private nursing wherever you are.',
      },
      {
        q: 'Can I wear YEZ BEE maternity kurtis after pregnancy?',
        a: 'Absolutely! Our designs feature flattering fluid A-line cuts and elegant silhouettes that drape naturally, making them perfect for pre-pregnancy, postpartum nursing, and long after.',
      },
      {
        q: 'What fabric is used in your loungewear and kurtis?',
        a: 'We use premium 100% breathable pure cotton, rayon, and mulmul fabrics that are hypoallergenic, super-soft, and gentle on sensitive mother and baby skin.',
      },
    ],
  },
  {
    category: 'Orders & Payments',
    items: [
      {
        q: 'What payment options are available?',
        a: 'We accept all major UPI apps (Google Pay, PhonePe, Paytm), Credit & Debit Cards, Net Banking, and Cash on Delivery (COD) across India.',
      },
      {
        q: 'How do I track my order?',
        a: 'Once your order is dispatched, you will receive an SMS and WhatsApp update with a live tracking link. You can also visit our Track Order page anytime with your order ID.',
      },
      {
        q: 'Is Cash on Delivery (COD) available?',
        a: 'Yes, Cash on Delivery is available across most serviceable pincodes in India.',
      },
    ],
  },
  {
    category: 'Shipping & Exchanges',
    items: [
      {
        q: 'What is your return/exchange policy?',
        a: 'We offer an easy 7-day size exchange and return policy. If the size does not fit, simply message our customer WhatsApp support, and we will arrange a doorstep pickup.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Orders are dispatched within 24-48 hours. Delivery takes 2-3 days within South India and 3-5 days for other major Indian cities.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<string | null>('0-0');

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-[var(--color-dark)]/50 font-medium mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--color-primary-gold)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--color-dark)] font-bold">FAQ</span>
        </nav>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-champagne)]/60 text-[var(--color-dark)] text-xs font-bold uppercase tracking-wider mb-4 border border-[var(--color-primary-gold)]/30">
            <Sparkles size={14} className="text-[var(--color-primary-gold)]" /> Quick Answers
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[var(--color-dark)] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto font-sans leading-relaxed">
            Have questions about maternity sizes, hidden feeding zips, or delivery? Find all answers here.
          </p>
        </div>

        <div className="space-y-8">
          {FAQS.map((cat, catIdx) => (
            <div key={cat.category} className="bg-white p-6 sm:p-8 rounded-3xl border border-[var(--color-champagne)] shadow-soft-sm">
              <h2 className="font-display text-xl font-bold text-[var(--color-dark)] mb-4">{cat.category}</h2>
              <div className="space-y-3">
                {cat.items.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  const isOpen = openIdx === key;
                  return (
                    <div key={item.q} className="border border-gray-100 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setOpenIdx(isOpen ? null : key)}
                        className="w-full text-left p-4 flex items-center justify-between gap-4 font-semibold text-sm text-[var(--color-dark)] hover:text-[var(--color-primary-gold)] transition-colors bg-gray-50/50"
                      >
                        <span>{item.q}</span>
                        <ChevronDown size={18} className={cn('shrink-0 transition-transform duration-200', isOpen && 'rotate-180 text-[var(--color-primary-gold)]')} />
                      </button>
                      {isOpen && (
                        <div className="p-4 text-xs sm:text-sm text-gray-600 leading-relaxed bg-white border-t border-gray-100">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[var(--color-champagne)]/40 p-6 sm:p-8 rounded-3xl border border-[var(--color-primary-gold)]/30 text-center">
          <h3 className="font-display text-lg font-bold text-[var(--color-dark)] mb-2">Still have questions?</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">Our fashion concierges are happy to help you anytime.</p>
          <div className="flex justify-center gap-4">
            <a
              href="https://wa.me/918760890906"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all"
            >
              <MessageCircle size={15} /> WhatsApp Support
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-dark)] text-white text-xs font-bold uppercase tracking-wider hover:bg-[var(--color-primary-gold)] hover:text-[var(--color-dark)] transition-all"
            >
              <Mail size={15} /> Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
