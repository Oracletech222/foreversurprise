'use client';

import { useState } from 'react';

const occasions = [
  ['♡', 'Just because'],
  ['✦', 'Birthday'],
  ['∞', 'Anniversary'],
  ['☼', 'Thank you'],
];

const bundles = [
  { name: 'The Sweetest Hello', detail: 'Peony bouquet · Bento cake', price: 2450, icon: '🌷', className: 'thumb-hello' },
  { name: 'A Little Celebration', detail: 'Roses · Cake · Gift box', price: 3250, icon: '🎁', className: 'thumb-celebrate' },
  { name: 'Forever Yours', detail: 'Premium bouquet · Gift hamper', price: 4800, icon: '💐', className: 'thumb-forever' },
];

const formatPrice = (price) => `Rs. ${price.toLocaleString('en-IN')}`;

export default function Home() {
  const [occasion, setOccasion] = useState('Just because');
  const [orderDetails, setOrderDetails] = useState({
    recipientName: '',
    recipientLocation: '',
    recipientPhone: '',
    deliveryName: '',
    deliveryLocation: 'Pokhara',
    deliveryPhone: '',
    cakeMessage: '',
  });
  const [selectedBundle, setSelectedBundle] = useState(bundles[0]);
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateOrderDetails = (event) => {
    const { name, value } = event.target;
    setOrderDetails((current) => ({ ...current, [name]: value }));
  };

  const checkout = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occasion, bundle: selectedBundle, ...orderDetails }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Please check your order details.');
      }

      setShowToast(`Order ${data.order.id} is ready for payment ♡`);
      window.setTimeout(() => setShowToast(false), 4200);
    } catch (checkoutError) {
      setError(checkoutError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Forever Surprise home"><span className="brand-mark">✦</span><span><strong>Forever</strong><em>Surprise</em></span></a>
        <nav className="main-nav" aria-label="Main navigation"><a href="#bundles">Gift bundles</a><a href="#how-it-works">How it works</a><a href="#stories">Love notes</a></nav>
        <button className="bag-button" type="button" aria-label="View your gift bag">Bag <span className="bag-count">1</span></button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy"><p className="eyebrow">Flowers, cake & a little wonder</p><h1>Make their day<br /><span>unforgettable.</span></h1><p className="hero-text">Beautiful surprises, thoughtfully packed and delivered across Pokhara. Pick a feeling, we’ll make it tangible.</p><a className="primary-button" href="#builder">Build a surprise <span>↗</span></a><div className="delivery-note"><span className="spark">✦</span><span><strong>Same-day delivery</strong><br />Order before 2:00 PM in Pokhara</span></div></div>
          <div className="hero-art" aria-label="Gift box, flowers and cake arrangement"><div className="sun-disc" /><div className="flower flower-one">✿</div><div className="flower flower-two">✿</div><div className="leaf leaf-one" /><div className="leaf leaf-two" /><div className="gift-ribbon ribbon-left" /><div className="gift-ribbon ribbon-right" /><div className="gift-box"><div className="gift-lid" /><div className="gift-band" /><div className="gift-bow">⌁</div></div><div className="cake"><div className="cake-top"><span>♡</span></div><div className="cake-body" /><div className="cake-stand" /></div><div className="art-caption"><span>made with</span><strong>love</strong></div></div>
        </section>

        <section className="builder-section" id="builder"><div className="section-intro"><p className="eyebrow">Your little ritual</p><h2>Start with a feeling.</h2><p>Tell us who it’s for and we’ll help you find the right kind of lovely.</p></div><div className="builder-grid">
          <div className="builder-form">
            <div className="form-step"><div className="step-heading"><span>01</span><h3>What are we celebrating?</h3></div><div className="occasion-list" role="group" aria-label="Choose an occasion">{occasions.map(([icon, label]) => <button className={`occasion ${occasion === label ? 'active' : ''}`} type="button" key={label} onClick={() => setOccasion(label)}><span>{icon}</span>{label}</button>)}</div></div>
            <div className="form-step"><div className="step-heading"><span>02</span><h3>Who’s the lucky one?</h3></div><div className="input-row"><label>Their name<input name="recipientName" type="text" placeholder="e.g. Anisha" value={orderDetails.recipientName} onChange={updateOrderDetails} /></label><label>Their phone number<input name="recipientPhone" type="tel" placeholder="e.g. 98XXXXXXXX" value={orderDetails.recipientPhone} onChange={updateOrderDetails} /></label><label className="wide-field">Their location<input name="recipientLocation" type="text" placeholder="e.g. Lakeside, Pokhara" value={orderDetails.recipientLocation} onChange={updateOrderDetails} /></label></div></div>
            <div className="form-step" id="bundles"><div className="step-heading"><span>03</span><h3>Choose your surprise</h3></div><div className="bundle-options">{bundles.map((bundle) => <button className={`bundle ${selectedBundle.name === bundle.name ? 'active' : ''}`} type="button" key={bundle.name} onClick={() => setSelectedBundle(bundle)}><span className={`bundle-thumb ${bundle.className}`}>{bundle.icon}</span><span><strong>{bundle.name}</strong><small>{bundle.detail}</small></span><b>{formatPrice(bundle.price)}</b></button>)}</div></div>
            <div className="form-step"><div className="step-heading"><span>04</span><h3>Where should we deliver?</h3></div><div className="input-row"><label>Delivery place name<input name="deliveryName" type="text" placeholder="e.g. Hotel Mountain View" value={orderDetails.deliveryName} onChange={updateOrderDetails} /></label><label>Delivery phone number<input name="deliveryPhone" type="tel" placeholder="e.g. 98XXXXXXXX" value={orderDetails.deliveryPhone} onChange={updateOrderDetails} /></label><label className="wide-field">Delivery location<select name="deliveryLocation" value={orderDetails.deliveryLocation} onChange={updateOrderDetails}><option>Pokhara</option><option>Lakeside</option><option>Bagar</option><option>New Road</option></select></label></div></div>
            <div className="form-step"><div className="step-heading"><span>05</span><h3>What should we write on the cake?</h3></div><div className="input-row"><label className="wide-field">Cake message<input name="cakeMessage" type="text" maxLength="60" placeholder="e.g. Happy Birthday Anisha!" value={orderDetails.cakeMessage} onChange={updateOrderDetails} /></label></div></div>
          </div>
          <aside className="summary-card order-card"><div className="summary-top"><span className="tiny-label">YOUR ORDER</span><span className="mini-heart">♡</span></div><div className="summary-visual"><span className="summary-flower">✿</span><div className="summary-gift">🎁</div><span className="summary-spark">✦</span></div><p className="summary-occasion">{occasion}</p><h3>{selectedBundle.name}</h3><p className="summary-recipient">For <span>{orderDetails.recipientName.trim() || 'someone wonderful'}</span></p><div className="summary-line"><span>Gift bundle</span><strong>{formatPrice(selectedBundle.price)}</strong></div><div className="summary-line"><span>Delivery</span><strong>Rs. 150</strong></div><div className="total-line"><span>Total</span><strong>{formatPrice(selectedBundle.price + 150)}</strong></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="checkout-button" type="button" onClick={checkout} disabled={isSubmitting}>{isSubmitting ? 'Sending your order...' : 'Send order to Forever Surprise'} {!isSubmitting && <span>→</span>}</button><p className="secure-note">♡ We’ll contact you to confirm delivery</p></aside>
        </div></section>

        <section className="how-section" id="how-it-works"><div className="section-intro"><p className="eyebrow">The easy part</p><h2>From your heart<br />to their hands.</h2></div><div className="steps"><div><span>01</span><h3>Pick a feeling</h3><p>Choose a ready-to-send bundle or make it personal.</p></div><div><span>02</span><h3>Add your words</h3><p>We’ll tuck your handwritten note in with the magic.</p></div><div><span>03</span><h3>We make the moment</h3><p>Fresh, beautiful, and delivered right on time.</p></div></div></section>
        <section className="stories-section" id="stories"><div className="story-quote">“It arrived like a tiny celebration.<br /><em>She cried happy tears.</em>”</div><div className="story-author"><span>— Srijana, Lakeside</span><span className="quote-dots">● ○ ○</span></div></section>
      </main>
      <footer><a className="brand" href="#top"><span className="brand-mark">✦</span><span><strong>Forever</strong><em>Surprise</em></span></a><span>Made for your favorite people · Pokhara, Nepal</span><span>© 2025 Forever Surprise</span></footer>
      <div className={`toast ${showToast ? 'show' : ''}`} role="status">Your surprise is ready to continue ♡</div>
    </>
  );
}