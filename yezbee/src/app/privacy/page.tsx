import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileText, 
  Cookie, 
  Share2, 
  UserX, 
  Globe, 
  Mail, 
  Instagram, 
  Sparkles, 
  Heart, 
  CheckCircle2, 
  Layers, 
  Video 
} from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Preethi Wear',
  description: 'Learn how Preethi Wear collects, uses, and protects your personal information with absolute security and care.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[var(--color-dark)]/50 font-medium mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--color-primary-gold)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--color-dark)] font-bold">Privacy Policy</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-champagne)]/60 text-[var(--color-dark)] text-xs font-bold uppercase tracking-wider mb-4 border border-[var(--color-primary-gold)]/30">
            <Sparkles size={14} className="text-[var(--color-primary-gold)]" /> Privacy &amp; Data Security
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[var(--color-dark)] mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto font-sans leading-relaxed">
            This Privacy Policy describes how Preethi Wear (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects, uses, and discloses personal information when you visit, use our services, or make purchases from preethiwear.in (the &ldquo;Site&rdquo;). By using our Services, you agree to the collection and use of your information as described in this policy.
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-[var(--color-champagne)] shadow-soft-sm text-gray-700 font-sans text-sm sm:text-base leading-relaxed">
          
          {/* 1. Information We Collect */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[var(--color-dark)]">
              <FileText className="text-[var(--color-primary-gold)] shrink-0" size={22} />
              <h2 className="font-display text-xl font-bold">Information We Collect and How We Use It</h2>
            </div>
            <p>We collect various types of personal information depending on how you interact with our Site:</p>
            <div className="space-y-3 pt-2">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-[var(--color-dark)] text-sm mb-1">1. Information You Provide Directly:</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Includes basic contact details (name, address, phone number, email), order information (billing/shipping address, payment details), account information (username, password), and customer support communications.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-[var(--color-dark)] text-sm mb-1">2. Information We Collect Automatically:</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  We use cookies and similar technologies to collect Usage Data such as device information, IP address, and browsing behavior to improve our services and user experience.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-[var(--color-dark)] text-sm mb-1">3. Information from Third Parties:</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  We may receive information from service providers like Shopify and payment processors to facilitate transactions and improve our services.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* 2. How We Use Your Personal Information */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[var(--color-dark)]">
              <Eye className="text-[var(--color-primary-gold)] shrink-0" size={22} />
              <h2 className="font-display text-xl font-bold">How We Use Your Personal Information</h2>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 pl-2">
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary-gold)] font-bold text-base">&bull;</span>
                <span><strong>Providing Products and Services:</strong> To process orders, manage accounts, and provide customer support.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary-gold)] font-bold text-base">&bull;</span>
                <span><strong>Marketing and Advertising:</strong> To send promotional communications and personalize advertising.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary-gold)] font-bold text-base">&bull;</span>
                <span><strong>Security and Fraud Prevention:</strong> To detect and prevent fraudulent activities.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary-gold)] font-bold text-base">&bull;</span>
                <span><strong>Communication:</strong> To communicate with you about your account, orders, and inquiries.</span>
              </li>
            </ul>
          </section>

          <hr className="border-gray-100" />

          {/* 3. Cookies */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[var(--color-dark)]">
              <Cookie className="text-[var(--color-primary-gold)] shrink-0" size={22} />
              <h2 className="font-display text-xl font-bold">Cookies</h2>
            </div>
            <p>
              We use cookies for site functionality, analytics, and personalized advertising. By using our Site, you consent to our use of cookies as described in our{' '}
              <a
                href="https://www.shopify.com/legal/cookies"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-primary-gold)] font-semibold underline hover:text-[var(--color-dark)] transition-colors"
              >
                Cookie Policy
              </a>.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* 4. How We Disclose Personal Information */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[var(--color-dark)]">
              <Share2 className="text-[var(--color-primary-gold)] shrink-0" size={22} />
              <h2 className="font-display text-xl font-bold">How We Disclose Personal Information</h2>
            </div>
            <p>We may disclose your information to:</p>
            <ul className="space-y-1.5 text-sm text-gray-600 pl-2">
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary-gold)] font-bold text-base">&bull;</span>
                <span>Service providers and partners who assist in delivering our services.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary-gold)] font-bold text-base">&bull;</span>
                <span>Business partners for marketing purposes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary-gold)] font-bold text-base">&bull;</span>
                <span>Legal authorities in compliance with applicable laws.</span>
              </li>
            </ul>
          </section>

          <hr className="border-gray-100" />

          {/* 5. User Generated Content & Third Party Links */}
          <div className="grid sm:grid-cols-2 gap-6">
            <section className="space-y-2">
              <h3 className="font-display text-base font-bold text-[var(--color-dark)]">User Generated Content</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Content you post publicly on our Site is accessible to others and may be used by third parties. We are not responsible for third-party use of publicly available information.
              </p>
            </section>
            <section className="space-y-2">
              <h3 className="font-display text-base font-bold text-[var(--color-dark)]">Third Party Websites and Links</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Our Site may contain links to third-party websites. We are not responsible for their privacy practices. Please review their policies before providing any personal information.
              </p>
            </section>
          </div>

          <hr className="border-gray-100" />

          {/* 6. Children's Data & Security and Retention */}
          <div className="grid sm:grid-cols-2 gap-6">
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-[var(--color-dark)]">
                <UserX size={18} className="text-[var(--color-primary-gold)]" />
                <h3 className="font-display text-base font-bold">Children&apos;s Data</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Our services are not intended for children under 16. If we discover we have collected personal information from a child, we will delete it promptly.
              </p>
            </section>
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-[var(--color-dark)]">
                <Lock size={18} className="text-[var(--color-primary-gold)]" />
                <h3 className="font-display text-base font-bold">Security and Retention</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                We implement security measures to protect your personal information but cannot guarantee absolute security. We retain your information as long as necessary for business purposes or as required by law.
              </p>
            </section>
          </div>

          <hr className="border-gray-100" />

          {/* 7. Rights, Complaints & International Users */}
          <section className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-xs sm:text-sm text-[var(--color-dark)] mb-1">Your Rights &amp; Choices</h4>
                <p className="text-xs text-gray-600">
                  Depending on your location, you may have rights such as access, deletion, correction, or objection to processing of your personal information. You can exercise these rights by contacting us.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-xs sm:text-sm text-[var(--color-dark)] mb-1">Complaints</h4>
                <p className="text-xs text-gray-600">
                  If you have concerns about our data practices, please contact us directly and our team will resolve your grievance promptly.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <Globe size={14} className="text-[var(--color-primary-gold)]" />
                  <h4 className="font-bold text-xs sm:text-sm text-[var(--color-dark)]">International Users</h4>
                </div>
                <p className="text-xs text-gray-600">
                  Your information may be transferred outside your country of residence, including to the United States. We use appropriate safeguards for international data transfers.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* 8. Contact Us */}
          <section className="space-y-3">
            <h3 className="font-display text-lg font-bold text-[var(--color-dark)]">Contact Us</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              If you have questions about our Privacy Policy or wish to exercise your rights, please contact us at:
            </p>
            <div className="inline-flex items-center gap-2 p-3 bg-[var(--color-champagne)]/40 rounded-xl border border-[var(--color-primary-gold)]/20">
              <Mail size={16} className="text-[var(--color-primary-gold)]" />
              <a href="mailto:support@preethiwear.in" className="text-xs font-semibold text-[var(--color-dark)] hover:underline">
                support@preethiwear.in
              </a>
            </div>
          </section>
        </div>

        {/* About Preethi Wear / Brand Story Section included from the text */}
        <div className="mt-12 bg-white p-6 sm:p-10 rounded-3xl border border-[var(--color-champagne)] shadow-soft-sm text-gray-700 font-sans text-sm sm:text-base leading-relaxed space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-champagne)]/60 text-[var(--color-dark)] text-xs font-bold uppercase tracking-wider mb-3 border border-[var(--color-primary-gold)]/30">
              <Heart size={14} className="text-[var(--color-primary-gold)]" /> About Us
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-[var(--color-dark)] mb-2">
              Welcome to Preethi Wear: Embracing Comfort During Your Journey
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm max-w-xl mx-auto">
              Welcome to Preethi Wear, where we specialize in creating stylish and comfortable clothing solutions for expecting mothers. Our mission is to support you through every stage of your journey, ensuring you feel relaxed, confident, and beautiful.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-5 bg-[var(--color-champagne)]/20 rounded-2xl border border-[var(--color-primary-gold)]/20 space-y-2">
              <h3 className="font-display text-base font-bold text-[var(--color-dark)]">Our Vision</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                At Preethi Wear, we understand the importance of comfort during pregnancy and beyond. Our vision is to redefine maternity wear by offering high-quality loungewear that adapts to your changing body and lifestyle needs.
              </p>
            </div>
            <div className="p-5 bg-[var(--color-champagne)]/20 rounded-2xl border border-[var(--color-primary-gold)]/20 space-y-2">
              <h3 className="font-display text-base font-bold text-[var(--color-dark)]">Our Commitment</h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-600">
                <li><strong>1. Comfort without Compromise:</strong> Soft, breathable fabrics with gentle support.</li>
                <li><strong>2. Stylish Designs:</strong> Practicality combined with fashionable confidence.</li>
                <li><strong>3. Thoughtful Details:</strong> Feeding flap for effortless nursing access.</li>
              </ul>
            </div>
          </div>

          {/* Behind the scenes */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[var(--color-dark)]">
              <Video className="text-[var(--color-primary-gold)] shrink-0" size={20} />
              <h3 className="font-display text-lg font-bold">Behind the Scenes</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Curious about how our maternity loungewear is crafted? Take a glimpse behind the scenes with our Instagram reels:
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                <strong className="block text-[var(--color-dark)] mb-1">1. Craftsmanship in Action</strong>
                <span className="text-gray-500">Care and precision in creating each piece.</span>
              </div>
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                <strong className="block text-[var(--color-dark)] mb-1">2. Fabric Selection</strong>
                <span className="text-gray-500">Selected for comfort and durability throughout pregnancy.</span>
              </div>
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                <strong className="block text-[var(--color-dark)] mb-1">3. Customer Stories</strong>
                <span className="text-gray-500">Inspiring stories from expecting mothers.</span>
              </div>
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                <strong className="block text-[var(--color-dark)] mb-1">4. Our Team</strong>
                <span className="text-gray-500">Passionate individuals creating exceptional products.</span>
              </div>
            </div>
          </div>

          {/* Connect With Us */}
          <div className="p-6 bg-[var(--color-dark)] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h4 className="font-display text-base font-bold text-[var(--color-primary-gold)] mb-1">Connect With Us</h4>
              <p className="text-xs text-white/70">Experience the difference with Preethi Wear. Explore our collection today.</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="mailto:support@preethiwear.in"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 text-xs font-semibold hover:bg-white/20 transition-all text-white"
              >
                <Mail size={14} /> Email Us
              </a>
              <a
                href="https://instagram.com/preethi.shapewear.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--color-primary-gold)] text-[var(--color-dark)] text-xs font-bold hover:brightness-110 transition-all"
              >
                <Instagram size={14} /> @preethi.shapewear.in
              </a>
            </div>
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
