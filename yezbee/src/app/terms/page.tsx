import Link from 'next/link';
import { 
  Scale, 
  ShieldCheck, 
  Sparkles, 
  FileCheck, 
  ShoppingBag, 
  AlertCircle, 
  FileText, 
  ExternalLink 
} from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | Preethiwear',
  description: 'Terms of Service and conditions of purchase for Preethiwear / Preethi Designers.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[var(--color-dark)]/50 font-medium mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--color-primary-gold)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--color-dark)] font-bold">Terms &amp; Conditions</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-champagne)]/60 text-[var(--color-dark)] text-xs font-bold uppercase tracking-wider mb-4 border border-[var(--color-primary-gold)]/30">
            <Sparkles size={14} className="text-[var(--color-primary-gold)]" /> User Agreement
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[var(--color-dark)] mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto font-sans leading-relaxed">
            Please read these terms carefully before accessing or making purchases on our website.
          </p>
        </div>

        {/* Main Terms Document */}
        <div className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-[var(--color-champagne)] shadow-soft-sm text-gray-700 font-sans text-sm sm:text-base leading-relaxed">
          
          {/* OVERVIEW */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[var(--color-dark)]">
              <Scale className="text-[var(--color-primary-gold)] shrink-0" size={22} />
              <h2 className="font-display text-xl font-bold">OVERVIEW</h2>
            </div>
            <p>
              This website is operated by Preethi Designers. Throughout the site, the terms &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo; refer to Preethiwear. Preethiwear offers this website, including all information, tools and Services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
            </p>
            <p>
              By visiting our site and/ or purchasing something from us, you engage in our &ldquo;Service&rdquo; and agree to be bound by the following terms and conditions (&ldquo;Terms of Service&rdquo;, &ldquo;Terms&rdquo;), including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/ or contributors of content.
            </p>
            <p>
              Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any Services. If these Terms of Service are considered an offer, acceptance is expressly limited to these Terms of Service.
            </p>
            <p>
              Any new features or tools which are added to the current store shall also be subject to the Terms of Service. You can review the most current version of the Terms of Service at any time on this page. We reserve the right to update, change or replace any part of these Terms of Service by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.
            </p>
            <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
              Our store is hosted on Shopify Inc. They provide us with the online e-commerce platform that allows us to sell our products and Services to you.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION 1 */}
          <section className="space-y-2">
            <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-dark)]">
              SECTION 1 - ONLINE STORE TERMS
            </h3>
            <p>
              By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.
            </p>
            <p>
              You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
            </p>
            <p>
              You must not transmit any worms or viruses or any code of a destructive nature.
            </p>
            <p className="text-red-700/80 font-medium text-xs sm:text-sm">
              A breach or violation of any of the Terms will result in an immediate termination of your Services.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION 2 */}
          <section className="space-y-2">
            <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-dark)]">
              SECTION 2 - GENERAL CONDITIONS
            </h3>
            <p>
              We reserve the right to refuse Service to anyone for any reason at any time.
            </p>
            <p>
              You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.
            </p>
            <p>
              You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the Service is provided, without express written permission by us.
            </p>
            <p className="text-xs text-gray-500">
              The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION 3 */}
          <section className="space-y-2">
            <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-dark)]">
              SECTION 3 - ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION
            </h3>
            <p>
              We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information. Any reliance on the material on this site is at your own risk.
            </p>
            <p>
              This site may contain certain historical information. Historical information, necessarily, is not current and is provided for your reference only. We reserve the right to modify the contents of this site at any time, but we have no obligation to update any information on our site. You agree that it is your responsibility to monitor changes to our site.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION 4 */}
          <section className="space-y-2">
            <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-dark)]">
              SECTION 4 - MODIFICATIONS TO THE SERVICE AND PRICES
            </h3>
            <p>
              Prices for our products are subject to change without notice.
            </p>
            <p>
              We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
            </p>
            <p>
              We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION 5 */}
          <section className="space-y-2">
            <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-dark)]">
              SECTION 5 - PRODUCTS OR SERVICES (if applicable)
            </h3>
            <p>
              Certain products or Services may be available exclusively online through the website. These products or Services may have limited quantities and are subject to return or exchange only according to our{' '}
              <Link href="/refund" className="text-[var(--color-primary-gold)] font-semibold underline hover:text-[var(--color-dark)]">
                Refund Policy
              </Link>.
            </p>
            <p>
              We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor&apos;s display of any color will be accurate.
            </p>
            <p>
              We reserve the right, but are not obligated, to limit the sales of our products or Services to any person, geographic region or jurisdiction. We may exercise this right on a case-by-case basis. We reserve the right to limit the quantities of any products or Services that we offer. All descriptions of products or product pricing are subject to change at anytime without notice, at the sole discretion of us. We reserve the right to discontinue any product at any time. Any offer for any product or Service made on this site is void where prohibited.
            </p>
            <p>
              We do not warrant that the quality of any products, Services, information, or other material purchased or obtained by you will meet your expectations, or that any errors in the Service will be corrected.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION 6 */}
          <section className="space-y-2">
            <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-dark)]">
              SECTION 6 - ACCURACY OF BILLING AND ACCOUNT INFORMATION
            </h3>
            <p>
              We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. These restrictions may include orders placed by or under the same customer account, the same credit card, and/or orders that use the same billing and/or shipping address. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e‑mail and/or billing address/phone number provided at the time the order was made. We reserve the right to limit or prohibit orders that, in our sole judgment, appear to be placed by dealers, resellers or distributors.
            </p>
            <p>
              You agree to provide current, complete and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed.
            </p>
            <p>
              For more details, please review our{' '}
              <Link href="/refund" className="text-[var(--color-primary-gold)] font-semibold underline hover:text-[var(--color-dark)]">
                Refund Policy
              </Link>.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION 7 */}
          <section className="space-y-2">
            <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-dark)]">
              SECTION 7 - OPTIONAL TOOLS
            </h3>
            <p>
              We may provide you with access to third-party tools over which we neither monitor nor have any control nor input.
            </p>
            <p>
              You acknowledge and agree that we provide access to such tools &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without any warranties, representations or conditions of any kind and without any endorsement. We shall have no liability whatsoever arising from or relating to your use of optional third-party tools.
            </p>
            <p>
              Any use by you of the optional tools offered through the site is entirely at your own risk and discretion and you should ensure that you are familiar with and approve of the terms on which tools are provided by the relevant third-party provider(s).
            </p>
            <p>
              We may also, in the future, offer new Services and/or features through the website (including the release of new tools and resources). Such new features and/or Services shall also be subject to these Terms of Service.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION 8 */}
          <section className="space-y-2">
            <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-dark)]">
              SECTION 8 - THIRD-PARTY LINKS
            </h3>
            <p>
              Certain content, products and Services available via our Service may include materials from third-parties.
            </p>
            <p>
              Third-party links on this site may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy and we do not warrant and will not have any liability or responsibility for any third-party materials or websites, or for any other materials, products, or Services of third-parties.
            </p>
            <p>
              We are not liable for any harm or damages related to the purchase or use of goods, Services, resources, content, or any other transactions made in connection with any third-party websites. Please review carefully the third-party&apos;s policies and practices and make sure you understand them before you engage in any transaction. Complaints, claims, concerns, or questions regarding third-party products should be directed to the third-party.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION 9 */}
          <section className="space-y-2">
            <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-dark)]">
              SECTION 9 - USER COMMENTS, FEEDBACK AND OTHER SUBMISSIONS
            </h3>
            <p>
              If, at our request, you send certain specific submissions (for example contest entries) or without a request from us, you send creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, or otherwise (collectively, &apos;comments&apos;), you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us. We are and shall be under no obligation (1) to maintain any comments in confidence; (2) to pay compensation for any comments; or (3) to respond to any comments.
            </p>
            <p>
              We may, but have no obligation to, monitor, edit or remove content that we determine in our sole discretion to be unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party’s intellectual property or these Terms of Service.
            </p>
            <p>
              You agree that your comments will not violate any right of any third-party, including copyright, trademark, privacy, personality or other personal or proprietary right. You further agree that your comments will not contain libelous or otherwise unlawful, abusive or obscene material, or contain any computer virus or other malware that could in any way affect the operation of the Service or any related website. You may not use a false e‑mail address, pretend to be someone other than yourself, or otherwise mislead us or third-parties as to the origin of any comments. You are solely responsible for any comments you make and their accuracy. We take no responsibility and assume no liability for any comments posted by you or any third-party.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION 10 */}
          <section className="space-y-2">
            <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-dark)]">
              SECTION 10 - PERSONAL INFORMATION
            </h3>
            <p>
              Your submission of personal information through the store is governed by our{' '}
              <Link href="/privacy" className="text-[var(--color-primary-gold)] font-semibold underline hover:text-[var(--color-dark)]">
                Privacy Policy
              </Link>.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION 11 */}
          <section className="space-y-2">
            <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-dark)]">
              SECTION 11 - ERRORS, INACCURACIES AND OMISSIONS
            </h3>
            <p>
              Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies or omissions that may relate to product descriptions, pricing, promotions, offers, product shipping charges, transit times and availability. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information in the Service or on any related website is inaccurate at any time without prior notice (including after you have submitted your order).
            </p>
            <p>
              We undertake no obligation to update, amend or clarify information in the Service or on any related website, including without limitation, pricing information, except as required by law. No specified update or refresh date applied in the Service or on any related website, should be taken to indicate that all information in the Service or on any related website has been modified or updated.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION 12 */}
          <section className="space-y-2">
            <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-dark)]">
              SECTION 12 - PROHIBITED USES
            </h3>
            <p>
              In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-xs sm:text-sm text-gray-600">
              <li>(a) for any unlawful purpose;</li>
              <li>(b) to solicit others to perform or participate in any unlawful acts;</li>
              <li>(c) to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances;</li>
              <li>(d) to infringe upon or violate our intellectual property rights or the intellectual property rights of others;</li>
              <li>(e) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability;</li>
              <li>(f) to submit false or misleading information;</li>
              <li>(g) to upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Service or of any related website, other websites, or the Internet;</li>
              <li>(h) to collect or track the personal information of others;</li>
              <li>(i) to spam, phish, pharm, pretext, spider, crawl, or scrape;</li>
              <li>(j) for any obscene or immoral purpose; or</li>
              <li>(k) to interfere with or circumvent the security features of the Service or any related website, other websites, or the Internet.</li>
            </ul>
            <p className="text-xs text-red-700/80 pt-1">
              We reserve the right to terminate your use of the Service or any related website for violating any of the prohibited uses.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION 13 */}
          <section className="space-y-2">
            <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-dark)]">
              SECTION 13 - DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY
            </h3>
            <p>
              We do not guarantee, represent or warrant that your use of our Service will be uninterrupted, timely, secure or error-free. We do not warrant that the results that may be obtained from the use of the Service will be accurate or reliable.
            </p>
            <p>
              You agree that from time to time we may remove the Service for indefinite periods of time or cancel the Service at any time, without notice to you.
            </p>
            <p>
              You expressly agree that your use of, or inability to use, the Service is at your sole risk. The Service and all products and Services delivered to you through the Service are (except as expressly stated by us) provided &apos;as is&apos; and &apos;as available&apos; for your use, without any representation, warranties or conditions of any kind, either express or implied, including all implied warranties or conditions of merchantability, merchantable quality, fitness for a particular purpose, durability, title, and non-infringement.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              In no case shall Preethiwear, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, Service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including, without limitation lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION 14 */}
          <section className="space-y-2">
            <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-dark)]">
              SECTION 14 - INDEMNIFICATION
            </h3>
            <p>
              You agree to indemnify, defend and hold harmless Preethiwear and our parent, subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, Service providers, subcontractors, suppliers, interns and employees, harmless from any claim or demand, including reasonable attorneys’ fees, made by any third-party due to or arising out of your breach of these Terms of Service or the documents they incorporate by reference, or your violation of any law or the rights of a third-party.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION 15 */}
          <section className="space-y-2">
            <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-dark)]">
              SECTION 15 - SEVERABILITY
            </h3>
            <p>
              In the event that any provision of these Terms of Service is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service, such determination shall not affect the validity and enforceability of any other remaining provisions.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION 16 */}
          <section className="space-y-2">
            <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-dark)]">
              SECTION 16 - TERMINATION
            </h3>
            <p>
              The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement for all purposes.
            </p>
            <p>
              These Terms of Service are effective unless and until terminated by either you or us. You may terminate these Terms of Service at any time by notifying us that you no longer wish to use our Services, or when you cease using our site.
            </p>
            <p>
              If in our sole judgment you fail, or we suspect that you have failed, to comply with any term or provision of these Terms of Service, we also may terminate this agreement at any time without notice and you will remain liable for all amounts due up to and including the date of termination; and/or accordingly may deny you access to our Services (or any part thereof).
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION 17 */}
          <section className="space-y-2">
            <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-dark)]">
              SECTION 17 - ENTIRE AGREEMENT
            </h3>
            <p>
              The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision.
            </p>
            <p>
              These Terms of Service and any policies or operating rules posted by us on this site or in respect to the Service constitutes the entire agreement and understanding between you and us and governs your use of the Service, superseding any prior or contemporaneous agreements, communications and proposals, whether oral or written, between you and us (including, but not limited to, any prior versions of the Terms of Service).
            </p>
            <p>
              Any ambiguities in the interpretation of these Terms of Service shall not be construed against the drafting party.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION 18 */}
          <section className="space-y-2">
            <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-dark)]">
              SECTION 18 - GOVERNING LAW
            </h3>
            <p>
              These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION 19 */}
          <section className="space-y-2">
            <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-dark)]">
              SECTION 19 - CHANGES TO TERMS OF SERVICE
            </h3>
            <p>
              You can review the most current version of the Terms of Service at any time at this page.
            </p>
            <p>
              We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes. Your continued use of or access to our website or the Service following the posting of any changes to these Terms of Service constitutes acceptance of those changes.
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
