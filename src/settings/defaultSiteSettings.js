/** Editable site copy — merged with localStorage in `mergeSavedSettings` */

export const DEFAULT_SITE_SETTINGS = {
  contact: {
    phoneDisplay: '0903 835 3163',
    phoneE164: '+2349038353163',
    whatsappWaMe: '2349038353163',
    email: 'bookings@zicoclean.com',
    footerAddress:
      'Add your shop address or service area here so customers know where you operate.',
  },
  whatsappPrefillMessage:
    'Hello ZICOCLEAN LAUNDRY AND DRYCLEANING SERVICES — I would like to book / ask about pricing.',
  pricingPlans: [
    {
      name: 'Essentials',
      tagline: 'Light weekly loads',
      price: '₦750',
      unit: 'per kg · wash & fold',
      features: ['Minimum 3 kg per order', 'Standard 24–48h turnaround', 'Neatly folded return'],
      cta: 'Order on WhatsApp',
      featured: false,
    },
    {
      name: 'Home comfort',
      tagline: 'Best value for families',
      price: '₦680',
      unit: 'per kg from 6 kg',
      features: ['Pickup & delivery window', 'Sorting by fabric & colour', 'Stain check included'],
      cta: 'Chat for a quote',
      featured: true,
    },
    {
      name: 'Care & press',
      tagline: 'Dry clean + crisp finish',
      price: 'from ₦1,200',
      unit: 'shirts · suits from ₦4,500',
      features: ['Delicates quoted with care', 'Hand finishing where needed', 'Inspection before bagging'],
      cta: 'Send garment list',
      featured: false,
    },
  ],
  priceList: [
    { label: 'Wash & fold (per kg)', value: 'from ₦750' },
    { label: 'Iron only (shirt / blouse)', value: 'from ₦500' },
    { label: 'Trousers / skirts pressed', value: 'from ₦400' },
    { label: 'Bedsheet set (wash)', value: 'from ₦2,800' },
    { label: 'Duvet (size dependent)', value: 'from ₦4,500' },
    { label: 'Curtains (per panel)', value: 'quoted' },
    { label: 'Express same-day / next-day', value: '+20–35%' },
  ],
};

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function normalizePlan(saved, fallback) {
  const features = Array.isArray(saved.features)
    ? saved.features.map((f) => String(f).trim()).filter(Boolean)
    : fallback.features;
  return {
    name: String(saved.name ?? fallback.name).trim() || fallback.name,
    tagline: String(saved.tagline ?? fallback.tagline).trim() || fallback.tagline,
    price: String(saved.price ?? fallback.price).trim() || fallback.price,
    unit: String(saved.unit ?? fallback.unit).trim() || fallback.unit,
    cta: String(saved.cta ?? fallback.cta).trim() || fallback.cta,
    featured: Boolean(saved.featured),
    features: features.length ? features : fallback.features,
  };
}

/**
 * Merges persisted JSON onto defaults so missing keys still work after upgrades.
 */
export function mergeSavedSettings(saved) {
  const base = clone(DEFAULT_SITE_SETTINGS);
  if (!saved || typeof saved !== 'object') return base;

  if (saved.contact && typeof saved.contact === 'object') {
    base.contact = {
      ...base.contact,
      phoneDisplay: String(saved.contact.phoneDisplay ?? base.contact.phoneDisplay).trim() || base.contact.phoneDisplay,
      phoneE164: (() => {
        let e164 = String(saved.contact.phoneE164 ?? base.contact.phoneE164).trim();
        if (e164 && !e164.startsWith('+')) {
          const d = e164.replace(/\D/g, '');
          e164 = d ? `+${d}` : base.contact.phoneE164;
        }
        return e164 || base.contact.phoneE164;
      })(),
      whatsappWaMe: String(saved.contact.whatsappWaMe ?? base.contact.whatsappWaMe).replace(/\D/g, '') || base.contact.whatsappWaMe,
      email: String(saved.contact.email ?? base.contact.email).trim() || base.contact.email,
      footerAddress: String(saved.contact.footerAddress ?? base.contact.footerAddress).trim() || base.contact.footerAddress,
    };
  }

  if (typeof saved.whatsappPrefillMessage === 'string' && saved.whatsappPrefillMessage.trim()) {
    base.whatsappPrefillMessage = saved.whatsappPrefillMessage.trim();
  }

  const defPlans = DEFAULT_SITE_SETTINGS.pricingPlans;
  if (Array.isArray(saved.pricingPlans) && saved.pricingPlans.length === defPlans.length) {
    base.pricingPlans = saved.pricingPlans.map((p, i) => normalizePlan(p, defPlans[i]));
    const featuredCount = base.pricingPlans.filter((p) => p.featured).length;
    if (featuredCount !== 1) {
      base.pricingPlans = base.pricingPlans.map((p, i) => ({ ...p, featured: i === 1 }));
    }
  }

  if (Array.isArray(saved.priceList) && saved.priceList.length > 0) {
    base.priceList = saved.priceList
      .filter((row) => row && (String(row.label || '').trim() || String(row.value || '').trim()))
      .map((row) => ({
        label: String(row.label || '').trim(),
        value: String(row.value || '').trim(),
      }));
  }

  return base;
}
