import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../settings/SiteSettingsContext';
import {
  clearAdminSession,
  getAdminPin,
  isAdminSessionUnlocked,
  setAdminSessionUnlocked,
} from './adminAuth';
import './admin.css';

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function plansFromDraft(draft) {
  const featuredIndex = draft.pricingPlans.findIndex((p) => p.featured);
  const idx = featuredIndex >= 0 ? featuredIndex : 1;
  return draft.pricingPlans.map((p, i) => {
    const { featuresText, features, ...rest } = p;
    const fromText =
      typeof featuresText === 'string'
        ? featuresText
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
    const feats = fromText.length ? fromText : Array.isArray(features) ? features : [];
    return {
      name: rest.name,
      tagline: rest.tagline,
      price: rest.price,
      unit: rest.unit,
      cta: rest.cta,
      featured: i === idx,
      features: feats,
    };
  });
}

function sanitizeDraftForSave(draft) {
  const pricingPlans = plansFromDraft(draft);

  const priceList = (draft.priceList || [])
    .filter((r) => r && (String(r.label).trim() || String(r.value).trim()))
    .map((r) => ({
      label: String(r.label || '').trim(),
      value: String(r.value || '').trim(),
    }));

  return {
    contact: {
      ...draft.contact,
      whatsappWaMe: String(draft.contact.whatsappWaMe || '').replace(/\D/g, ''),
    },
    whatsappPrefillMessage: String(draft.whatsappPrefillMessage || '').trim(),
    pricingPlans,
    priceList: priceList.length ? priceList : draft.priceList,
  };
}

function draftWithFeaturesText(settings) {
  const d = clone(settings);
  d.pricingPlans = d.pricingPlans.map((p) => ({
    ...p,
    featuresText: Array.isArray(p.features) ? p.features.join('\n') : '',
  }));
  return d;
}

export default function AdminPage() {
  const expectedPin = getAdminPin();
  const [unlocked, setUnlocked] = useState(() => isAdminSessionUnlocked());
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const { settings, commitSettings, resetToDefaults } = useSiteSettings();
  const [draft, setDraft] = useState(() => draftWithFeaturesText(settings));
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    setDraft(draftWithFeaturesText(settings));
  }, [settings]);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (expectedPin != null && pinInput === expectedPin) {
      setAdminSessionUnlocked();
      setUnlocked(true);
      setPinError('');
      setPinInput('');
    } else {
      setPinError('Incorrect PIN. Try again.');
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    setUnlocked(false);
    setPinInput('');
    setPinError('');
  };

  const showDevPinHint =
    process.env.NODE_ENV !== 'production' && !process.env.REACT_APP_ADMIN_PIN;

  const updateContact = useCallback((field, value) => {
    setDraft((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  }, []);

  const updatePlan = useCallback((index, field, value) => {
    setDraft((prev) => {
      const plans = [...prev.pricingPlans];
      plans[index] = { ...plans[index], [field]: value };
      return { ...prev, pricingPlans: plans };
    });
  }, []);

  const setFeaturedPlan = useCallback((index) => {
    setDraft((prev) => ({
      ...prev,
      pricingPlans: prev.pricingPlans.map((p, i) => ({ ...p, featured: i === index })),
    }));
  }, []);

  const updatePriceRow = useCallback((index, field, value) => {
    setDraft((prev) => {
      const rows = [...prev.priceList];
      rows[index] = { ...rows[index], [field]: value };
      return { ...prev, priceList: rows };
    });
  }, []);

  const addPriceRow = useCallback(() => {
    setDraft((prev) => ({
      ...prev,
      priceList: [...prev.priceList, { label: '', value: '' }],
    }));
  }, []);

  const removePriceRow = useCallback((index) => {
    setDraft((prev) => ({
      ...prev,
      priceList: prev.priceList.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const payload = sanitizeDraftForSave(draft);
    commitSettings(payload);
    setSavedMsg('Saved. Return to the website — updates apply immediately on this device.');
    window.setTimeout(() => setSavedMsg(''), 5000);
  };

  const handleReset = () => {
    if (!window.confirm('Reset all editable prices and contact details to built-in defaults?')) return;
    resetToDefaults();
    setSavedMsg('Restored defaults.');
    window.setTimeout(() => setSavedMsg(''), 4000);
  };

  if (expectedPin === null) {
    return (
      <div className="admin">
        <div className="admin-login">
          <div className="admin-login__card">
            <h1 className="admin-login__title">Admin is not available</h1>
            <p className="admin-login__text">
              This production build has no admin PIN configured. Add{' '}
              <code className="admin-login__code">REACT_APP_ADMIN_PIN</code> to your environment (for example in
              <code className="admin-login__code"> .env.production</code>
              ), then run a new build. Use a strong secret; it is embedded at build time.
            </p>
            <Link className="admin__link admin-login__back" to="/">
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="admin">
        <div className="admin-login">
          <form className="admin-login__card" onSubmit={handleUnlock}>
            <h1 className="admin-login__title">Admin sign-in</h1>
            {showDevPinHint ? (
              <p className="admin-login__hint">
                Local / test default PIN: <code className="admin-login__code">0000</code> — set{' '}
                <code className="admin-login__code">REACT_APP_ADMIN_PIN</code> in <code className="admin-login__code">.env</code> to use your own.
              </p>
            ) : null}
            <label className="admin-login__label">
              <span>PIN</span>
              <input
                className="admin-login__input"
                type="password"
                name="admin-pin"
                autoComplete="current-password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError('');
                }}
                placeholder="Enter PIN"
              />
            </label>
            {pinError ? <p className="admin-login__error">{pinError}</p> : null}
            <div className="admin-login__actions">
              <button type="submit" className="admin__btn admin__btn--primary">
                Unlock
              </button>
              <Link className="admin__link" to="/">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const waDigits = String(draft.contact.whatsappWaMe || '').replace(/\D/g, '');

  return (
    <div className="admin">
      <header className="admin__header">
        <div className="admin__header-inner">
          <h1 className="admin__title">Site admin</h1>
          <div className="admin__header-actions">
            <button type="button" className="admin__btn admin__btn--ghost admin__btn--compact" onClick={handleLogout}>
              Sign out
            </button>
            <Link className="admin__link" to="/">
              ← Back to website
            </Link>
          </div>
        </div>
        <p className="admin__lede">
          Update pricing and contact information. Changes are stored in this browser only (
          <code>localStorage</code>
          ). This screen is protected by a PIN (session-only until you sign out or close the tab). Use the same
          device/browser to see updates on the public site.
        </p>
      </header>

      <main className="admin__main">
        {savedMsg ? <p className="admin__flash">{savedMsg}</p> : null}

        <form className="admin__form" onSubmit={handleSave}>
          <section className="admin__section">
            <h2 className="admin__section-title">Contact &amp; WhatsApp</h2>
            <div className="admin__grid">
              <label className="admin__field">
                <span>Phone display (how it appears on the site)</span>
                <input
                  value={draft.contact.phoneDisplay}
                  onChange={(e) => updateContact('phoneDisplay', e.target.value)}
                  autoComplete="off"
                />
              </label>
              <label className="admin__field">
                <span>Phone for calls (include country code, e.g. +2349038353163)</span>
                <input
                  value={draft.contact.phoneE164}
                  onChange={(e) => updateContact('phoneE164', e.target.value)}
                  autoComplete="off"
                />
              </label>
              <label className="admin__field admin__field--wide">
                <span>WhatsApp number (digits only for wa.me, e.g. 2349038353163)</span>
                <input
                  value={draft.contact.whatsappWaMe}
                  onChange={(e) => updateContact('whatsappWaMe', e.target.value.replace(/[^\d]/g, ''))}
                  inputMode="numeric"
                  placeholder="2349038353163"
                  autoComplete="off"
                />
                <small className="admin__hint">Current link target: wa.me/{waDigits || '…'}</small>
              </label>
              <label className="admin__field admin__field--wide">
                <span>Email (bookings &amp; mailto links)</span>
                <input
                  type="email"
                  value={draft.contact.email}
                  onChange={(e) => updateContact('email', e.target.value)}
                  autoComplete="off"
                />
              </label>
              <label className="admin__field admin__field--wide">
                <span>WhatsApp pre-filled message</span>
                <textarea
                  rows={3}
                  value={draft.whatsappPrefillMessage}
                  onChange={(e) => setDraft((p) => ({ ...p, whatsappPrefillMessage: e.target.value }))}
                />
              </label>
              <label className="admin__field admin__field--wide">
                <span>Footer “Visit” text (address / service area)</span>
                <textarea
                  rows={4}
                  value={draft.contact.footerAddress}
                  onChange={(e) => updateContact('footerAddress', e.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="admin__section">
            <h2 className="admin__section-title">Pricing plans (3 cards)</h2>
            <p className="admin__muted">Choose which plan shows the “Popular” ribbon.</p>
            <div className="admin__plans">
              {draft.pricingPlans.map((plan, i) => (
                <fieldset key={i} className="admin__plan-card">
                  <legend className="admin__plan-legend">
                    <label>
                      <input
                        type="radio"
                        name="featuredPlan"
                        checked={plan.featured}
                        onChange={() => setFeaturedPlan(i)}
                      />
                      Featured
                    </label>
                    <span className="admin__plan-index">Plan {i + 1}</span>
                  </legend>
                  <label className="admin__field">
                    <span>Name</span>
                    <input value={plan.name} onChange={(e) => updatePlan(i, 'name', e.target.value)} />
                  </label>
                  <label className="admin__field">
                    <span>Tagline</span>
                    <input value={plan.tagline} onChange={(e) => updatePlan(i, 'tagline', e.target.value)} />
                  </label>
                  <label className="admin__field">
                    <span>Price line</span>
                    <input value={plan.price} onChange={(e) => updatePlan(i, 'price', e.target.value)} />
                  </label>
                  <label className="admin__field">
                    <span>Unit / subtitle</span>
                    <input value={plan.unit} onChange={(e) => updatePlan(i, 'unit', e.target.value)} />
                  </label>
                  <label className="admin__field">
                    <span>Button label</span>
                    <input value={plan.cta} onChange={(e) => updatePlan(i, 'cta', e.target.value)} />
                  </label>
                  <label className="admin__field">
                    <span>Bullets (one per line)</span>
                    <textarea
                      rows={4}
                      value={plan.featuresText}
                      onChange={(e) => updatePlan(i, 'featuresText', e.target.value)}
                    />
                  </label>
                </fieldset>
              ))}
            </div>
          </section>

          <section className="admin__section">
            <div className="admin__section-head">
              <h2 className="admin__section-title">Quick reference price list</h2>
              <button type="button" className="admin__btn admin__btn--ghost" onClick={addPriceRow}>
                Add row
              </button>
            </div>
            <div className="admin__table-wrap">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price text</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {draft.priceList.map((row, i) => (
                    <tr key={i}>
                      <td>
                        <input value={row.label} onChange={(e) => updatePriceRow(i, 'label', e.target.value)} />
                      </td>
                      <td>
                        <input value={row.value} onChange={(e) => updatePriceRow(i, 'value', e.target.value)} />
                      </td>
                      <td>
                        <button type="button" className="admin__btn admin__btn--danger" onClick={() => removePriceRow(i)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="admin__actions">
            <button type="submit" className="admin__btn admin__btn--primary">
              Save changes
            </button>
            <button type="button" className="admin__btn admin__btn--ghost" onClick={handleReset}>
              Reset to defaults
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
