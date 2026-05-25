import { useEffect, useState, useCallback } from 'react';
import '../App.css';
import { SafeImage } from '../components/SafeImage';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useSiteSettings } from '../settings/SiteSettingsContext';
import {
  FAQ_ITEMS,
  LAUNDRY_IMAGES,
  NAV_LINKS,
  SERVICES,
  STEPS,
  TESTIMONIALS,
} from '../landing/content';

export default function LandingPage() {
  const { settings, whatsappHref, telHref, mailtoBooking } = useSiteSettings();
  const { contact } = settings;
  const { pricingPlans, priceList } = settings;

  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useScrollReveal();

  useEffect(() => {
    document.body.classList.toggle('nav-open', menuOpen);
    return () => document.body.classList.remove('nav-open');
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const handleNavClick = () => closeMenu();

  const mailtoPickup = mailtoBooking('Pickup request', '');

  return (
    <div className="site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <a
        className="wa-float"
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat on WhatsApp — ${contact.phoneDisplay}`}
      >
        <span className="wa-float__pulse" aria-hidden="true" />
        <WhatsAppIcon className="wa-float__icon" />
        <span className="wa-float__label">WhatsApp</span>
      </a>

      <header
        className={[
          'site-header',
          scrolled ? 'site-header--scrolled' : '',
          menuOpen ? 'site-header--nav-open' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="site-header__inner">
          <a className="brand" href="#top" onClick={closeMenu}>
            <span className="brand__mark" aria-hidden="true" />
            <span className="brand__text">
              <span className="brand__name">Zicoclean</span>
              <span className="brand__tag">Laundry &amp; drycleaning services</span>
            </span>
          </a>

          <button
            type="button"
            className="nav-toggle"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="nav-toggle__bar" />
            <span className="nav-toggle__bar" />
            <span className="nav-toggle__bar" />
            <span className="visually-hidden">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          </button>

          <nav
            id="site-nav"
            className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`}
            aria-label="Primary"
            aria-hidden={!menuOpen}
          >
            <ul className="site-nav__list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="site-nav__link" onClick={handleNavClick}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="site-nav__cta">
              <a className="btn btn--wa" href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={handleNavClick}>
                <WhatsAppIcon className="wa-icon wa-icon--nav" />
                WhatsApp
              </a>
              <a className="btn btn--primary" href="#contact" onClick={handleNavClick}>
                Book a pickup
              </a>
            </div>
          </nav>
        </div>
      </header>

      {menuOpen ? (
        <button type="button" className="nav-backdrop" aria-label="Close menu" onClick={closeMenu} />
      ) : null}

      <main id="main">
        <section id="top" className="hero">
          <div className="hero__bg" aria-hidden="true" />
          <div className="container hero__grid">
            <div className="hero__copy hero__copy--animate">
              <p className="eyebrow">ZICOCLEAN LAUNDRY AND DRYCLEANING SERVICES</p>
              <h1 className="hero__title">Fresh clothes, zero hassle.</h1>
              <p className="hero__lead">
                Professional wash, fold, and dry cleaning with pickup and delivery built around your schedule.
                Spend less time on laundry and more on what matters.
              </p>
              <div className="hero__actions">
                <a className="btn btn--primary btn--lg" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="wa-icon wa-icon--hero" />
                  WhatsApp us
                </a>
                <a className="btn btn--ghost btn--lg" href="#services">
                  Explore services
                </a>
              </div>
              <ul className="hero__trust" aria-label="Highlights">
                <li>Tracked orders from door to door</li>
                <li>Care labels respected by default</li>
                <li>Friendly local team</li>
              </ul>
            </div>
            <div className="hero__panel" role="presentation">
              <div className="hero-visual" data-reveal>
                <figure className="hero-visual__frame hero-visual__frame--main">
                  <SafeImage
                    src={LAUNDRY_IMAGES.heroMain}
                    alt="Laundry being cleaned with professional care"
                    className="hero-visual__img"
                    width={480}
                    height={600}
                    fetchPriority="high"
                    decoding="async"
                  />
                </figure>
                <figure className="hero-visual__frame hero-visual__frame--float">
                  <SafeImage
                    src={LAUNDRY_IMAGES.heroSide}
                    alt="Freshly folded towels and linens"
                    className="hero-visual__img"
                    width={360}
                    height={440}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              </div>
              <div className="hero-card" data-reveal>
                <h2 className="hero-card__title">This week’s window</h2>
                <p className="hero-card__text">
                  Morning and evening slots are filling fast. Reserve your pickup and we will confirm by text or call.
                </p>
                <ul className="hero-card__list">
                  <li>
                    <strong>Mon–Sat</strong> · 7:00–20:00
                  </li>
                  <li>
                    <strong>Typical turnaround</strong> · 24–48 hours
                  </li>
                  <li>
                    <strong>Express</strong> · Ask when you book
                  </li>
                </ul>
                <a className="btn btn--secondary btn--block" href={telHref}>
                  Call {contact.phoneDisplay}
                </a>
                <p className="hero-card__note">We confirm your slot by phone or text — tell us any special care notes when you call.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="stats" aria-label="At a glance">
          <div className="container stats__grid">
            <div className="stat" data-reveal>
              <span className="stat__value">24–48h</span>
              <span className="stat__label">Standard turnaround</span>
            </div>
            <div className="stat" data-reveal>
              <span className="stat__value">100%</span>
              <span className="stat__label">Inspection before return</span>
            </div>
            <div className="stat" data-reveal>
              <span className="stat__value">Doorstep</span>
              <span className="stat__label">Pickup &amp; delivery</span>
            </div>
            <div className="stat" data-reveal>
              <span className="stat__value">Care</span>
              <span className="stat__label">Delicates &amp; formal wear</span>
            </div>
          </div>
        </section>

        <section className="gallery-strip" aria-label="Laundry and care">
          <div className="gallery-strip__inner container">
            <figure className="gallery-strip__item" data-reveal>
              <SafeImage src={LAUNDRY_IMAGES.gallery1} alt="Laundry baskets and fresh fabrics" loading="lazy" decoding="async" width={400} height={280} />
              <figcaption>Pickup-ready sorting</figcaption>
            </figure>
            <figure className="gallery-strip__item" data-reveal>
              <SafeImage src={LAUNDRY_IMAGES.gallery2} alt="Ironing and pressing for a crisp finish" loading="lazy" decoding="async" width={400} height={280} />
              <figcaption>Pressing &amp; finish</figcaption>
            </figure>
            <figure className="gallery-strip__item" data-reveal>
              <SafeImage src={LAUNDRY_IMAGES.gallery3} alt="Clean bedding folded neatly" loading="lazy" decoding="async" width={400} height={280} />
              <figcaption>Bedding &amp; bulky care</figcaption>
            </figure>
          </div>
        </section>

        <section id="services" className="section">
          <div className="container">
            <header className="section__head" data-reveal>
              <h2 className="section__title">Services tailored to your wardrobe</h2>
              <p className="section__intro">
                Whether it is daily essentials or pieces that need specialist handling, we combine modern equipment
                with careful hand finishing where it counts.
              </p>
            </header>
            <div className="card-grid">
              {SERVICES.map((s, i) => (
                <article key={s.title} className="card" data-reveal style={{ '--reveal-delay': `${i * 70}ms` }}>
                  <div className="card__media">
                    <SafeImage src={s.image} alt="" width={400} height={250} loading="lazy" decoding="async" />
                  </div>
                  <div className="card__body">
                    <h3 className="card__title">{s.title}</h3>
                    <p className="card__text">{s.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="section section--tint">
          <div className="container">
            <header className="section__head" data-reveal>
              <h2 className="section__title">How it works</h2>
              <p className="section__intro">Three simple steps from messy pile to wardrobe-ready.</p>
            </header>
            <ol className="steps">
              {STEPS.map((step, i) => (
                <li key={step.title} className="steps__item" data-reveal style={{ '--reveal-delay': `${i * 90}ms` }}>
                  <div className="steps__media">
                    <SafeImage src={step.image} alt="" width={320} height={200} loading="lazy" decoding="async" />
                  </div>
                  <span className="steps__num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3 className="steps__title">{step.title}</h3>
                  <p className="steps__text">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="pricing" className="section section--pricing">
          <div className="container">
            <header className="section__head" data-reveal>
              <h2 className="section__title">Pricing that stays clear</h2>
              <p className="section__intro">
                Pick a plan-style bundle for everyday laundry, or mix dry cleaning and press items. Final totals depend
                on weight, fabric, and add-ons — confirm on WhatsApp for an exact quote.
              </p>
            </header>

            <div className="pricing-plans">
              {pricingPlans.map((plan, i) => (
                <article
                  key={`${plan.name}-${i}`}
                  className={`price-plan ${plan.featured ? 'price-plan--featured' : ''}`}
                  data-reveal
                  style={{ '--reveal-delay': `${i * 80}ms` }}
                >
                  {plan.featured ? <span className="price-plan__badge">Popular</span> : null}
                  <h3 className="price-plan__name">{plan.name}</h3>
                  <p className="price-plan__tagline">{plan.tagline}</p>
                  <p className="price-plan__price">
                    <span className="price-plan__amount">{plan.price}</span>
                    <span className="price-plan__unit">{plan.unit}</span>
                  </p>
                  <ul className="price-plan__features">
                    {plan.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <a className="btn btn--primary btn--block price-plan__cta" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    {plan.cta}
                  </a>
                </article>
              ))}
            </div>

            <p className="pricing-disclaimer" data-reveal>
              Sample rates for planning only — we confirm every job before processing. Volume discounts available for
              weekly customers.
            </p>

            <div className="pricing pricing--below-plans" data-reveal>
              <div className="pricing__copy">
                <h3 className="pricing__subhead">À la carte guide</h3>
                <p className="section__intro section__intro--left">
                  Handy reference for one-off items. Bulky pieces and designer labels are quoted after a quick look —
                  send a photo on WhatsApp for the fastest answer.
                </p>
                <ul className="pricing__bullets">
                  <li>Itemised receipt when we return your order</li>
                  <li>No surprise surcharges for standard care labels</li>
                  <li>Express service priced upfront if you need a rush</li>
                </ul>
                <div className="pricing__actions">
                  <a className="btn btn--primary" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    WhatsApp for exact quote
                  </a>
                  <a className="btn btn--ghost" href={telHref}>
                    Call {contact.phoneDisplay}
                  </a>
                </div>
              </div>
              <aside className="pricing__aside" aria-label="Price list">
                <h3 className="pricing__aside-title">Quick reference</h3>
                <p className="pricing__aside-note">Nigerian Naira (₦) · indicative only</p>
                <ul className="price-list">
                  {priceList.map((row, idx) => (
                    <li key={`${row.label}-${idx}`}>
                      <span>{row.label}</span>
                      <span>{row.value}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </div>
        </section>

        <section className="section section--tint" aria-labelledby="stories-heading">
          <div className="container">
            <h2 id="stories-heading" className="section__title" data-reveal>
              What neighbours say
            </h2>
            <p className="section__intro" data-reveal>
              Real feedback from people who switched their weekly laundry to us.
            </p>
            <div className="testimonial-grid">
              {TESTIMONIALS.map((t, i) => (
                <blockquote key={t.name} className="testimonial" data-reveal style={{ '--reveal-delay': `${i * 70}ms` }}>
                  <p className="testimonial__quote">“{t.quote}”</p>
                  <footer className="testimonial__meta">
                    <cite className="testimonial__name">{t.name}</cite>
                    <span className="testimonial__role">{t.role}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="section">
          <div className="container container--narrow">
            <header className="section__head" data-reveal>
              <h2 className="section__title">Frequently asked questions</h2>
              <p className="section__intro">Tap a question to read the answer.</p>
            </header>
            <div className="faq">
              {FAQ_ITEMS.map((item, index) => {
                const open = openFaq === index;
                const id = `faq-panel-${index}`;
                const btnId = `faq-btn-${index}`;
                return (
                  <div key={item.q} className={`faq__item ${open ? 'faq__item--open' : ''}`}>
                    <h3 className="faq__question">
                      <button
                        type="button"
                        id={btnId}
                        className="faq__trigger"
                        aria-expanded={open}
                        aria-controls={id}
                        onClick={() => toggleFaq(index)}
                      >
                        {item.q}
                        <span className="faq__icon" aria-hidden="true" />
                      </button>
                    </h3>
                    <div id={id} role="region" aria-labelledby={btnId} className="faq__panel" hidden={!open}>
                      <p className="faq__answer">{item.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="contact" className="section section--cta">
          <div className="container contact">
            <div className="contact__copy" data-reveal>
              <h2 className="section__title section__title--left">Ready for fresher laundry?</h2>
              <p className="section__intro section__intro--left">
                Tell us what you need and the best time to reach you. We will respond with availability and next steps.
              </p>
              <div className="contact__channels">
                <a className="contact-chip contact-chip--wa" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <span className="contact-chip__label">WhatsApp</span>
                  <span className="contact-chip__value">{contact.phoneDisplay}</span>
                </a>
                <a className="contact-chip" href={telHref}>
                  <span className="contact-chip__label">Phone</span>
                  <span className="contact-chip__value">{contact.phoneDisplay}</span>
                </a>
                <a className="contact-chip" href={mailtoPickup}>
                  <span className="contact-chip__label">Email</span>
                  <span className="contact-chip__value">{contact.email}</span>
                </a>
              </div>
            </div>
            <form
              className="contact-form"
              data-reveal
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const name = form.name.value.trim();
                const phone = form.phone.value.trim();
                const message = form.message.value.trim();
                const body = `Name: ${name}\nPhone: ${phone}\n\nMessage:\n${message}`;
                window.location.href = mailtoBooking('Zicoclean pickup request', body);
              }}
            >
              <label className="field">
                <span className="field__label">Name</span>
                <input className="field__input" name="name" type="text" autoComplete="name" required placeholder="Your name" />
              </label>
              <label className="field">
                <span className="field__label">Phone</span>
                <input className="field__input" name="phone" type="tel" autoComplete="tel" required placeholder="Best number to call" />
              </label>
              <label className="field">
                <span className="field__label">What do you need cleaned?</span>
                <textarea
                  className="field__input field__input--textarea"
                  name="message"
                  rows={4}
                  required
                  placeholder="e.g. 2 bags wash & fold, 1 suit for dry clean, pickup Tuesday evening"
                />
              </label>
              <button type="submit" className="btn btn--primary btn--lg btn--block">
                Send request by email
              </button>
              <p className="contact-form__hint">Opens your email app with your message ready to send.</p>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__grid">
          <div className="site-footer__brand">
            <span className="brand__mark brand__mark--footer" aria-hidden="true" />
            <p className="site-footer__name">ZICOCLEAN LAUNDRY AND DRYCLEANING SERVICES</p>
            <p className="site-footer__tag">Care you can feel, convenience you will notice.</p>
          </div>
          <div>
            <h2 className="site-footer__heading">Explore</h2>
            <ul className="site-footer__links">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="site-footer__heading">Visit</h2>
            <p className="site-footer__text">{contact.footerAddress}</p>
            <a className="site-footer__wa" href={whatsappHref} target="_blank" rel="noopener noreferrer">
              WhatsApp {contact.phoneDisplay}
            </a>
          </div>
        </div>
        <div className="site-footer__bar">
          <div className="container site-footer__bar-inner">
            <p>© {new Date().getFullYear()} ZICOCLEAN LAUNDRY AND DRYCLEANING SERVICES. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
