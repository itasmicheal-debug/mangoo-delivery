/** Build tel / mailto / WhatsApp URLs from merged settings */

export function buildWhatsAppHref(settings) {
  const wa = String(settings?.contact?.whatsappWaMe || '').replace(/\D/g, '');
  const msg = settings?.whatsappPrefillMessage || '';
  if (!wa) return 'https://wa.me/';
  return `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`;
}

export function buildTelHref(settings) {
  let raw = String(settings?.contact?.phoneE164 || '').trim();
  if (!raw) return 'tel:';
  if (!raw.startsWith('+')) {
    const digits = raw.replace(/\D/g, '');
    raw = digits ? `+${digits}` : raw;
  }
  return `tel:${raw}`;
}

export function buildMailtoBooking(settings, subject, body) {
  const email = String(settings?.contact?.email || '').trim();
  if (!email) return 'mailto:';
  const q = new URLSearchParams();
  if (subject) q.set('subject', subject);
  if (body) q.set('body', body);
  const qs = q.toString();
  return qs ? `mailto:${email}?${qs}` : `mailto:${email}`;
}
