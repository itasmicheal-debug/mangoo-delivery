/** Build a stable Unsplash CDN URL (photo id must exist or the image 404s). */
export function unsplash(photoId, width = 800) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=80`;
}

/** Shown if a remote image fails (network, removed photo, etc.) */
export const IMAGE_FALLBACK = unsplash('photo-1581578731548-c64695cc6952', 800);

export const NAV_LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
];

export const LAUNDRY_IMAGES = {
  heroMain: unsplash('photo-1722097981809-042e0467ba12', 960),
  heroSide: unsplash('photo-1635274605638-d44babc08a4f', 720),
  gallery1: unsplash('photo-1581578731548-c64695cc6952', 800),
  gallery2: unsplash('photo-1582479429421-321775166674', 800),
  gallery3: unsplash('photo-1699797467199-6bdf301649e8', 800),
};

export const SERVICES = [
  {
    title: 'Wash & fold',
    text: 'Everyday laundry sorted by fabric and temperature, neatly folded and ready to put away.',
    image: unsplash('photo-1582735689369-4fe89db7114c', 800),
  },
  {
    title: 'Dry cleaning',
    text: 'Suits, dresses, delicates, and formal wear treated with care and inspected before return.',
    image: unsplash('photo-1593030761757-71fae45fa0e7', 800),
  },
  {
    title: 'Stain treatment',
    text: 'Targeted pre-treatment on stubborn marks before the main clean, with fabric-safe products.',
    image: unsplash('photo-1586284359445-2e1d8db7f4cd', 800),
  },
  {
    title: 'Ironing & pressing',
    text: 'Crisp shirts, trousers, and linens pressed to a professional finish for work or events.',
    image: unsplash('photo-1567113463300-102a7eb3cb26', 800),
  },
  {
    title: 'Bedding & bulky',
    text: 'Duvets, blankets, and curtains handled with the right drum space and drying for freshness.',
    image: unsplash('photo-1699797467199-6bdf301649e8', 800),
  },
  {
    title: 'Express options',
    text: 'Tight deadline? Ask about same-day or next-day turnaround where capacity allows.',
    image: unsplash('photo-1722859179652-f188ed49e484', 800),
  },
];

export const STEPS = [
  {
    title: 'Book online or by phone',
    text: 'Pick a slot, add notes for stains or preferences, and we will confirm your pickup.',
    image: unsplash('photo-1556761175-5973dc0f32e7', 600),
  },
  {
    title: 'We collect & clean',
    text: 'Your items are processed with the right programme, temperature, and finishing.',
    image: unsplash('photo-1696546761269-a8f9d2b80512', 600),
  },
  {
    title: 'Delivery to your door',
    text: 'Folded, hung, or wrapped — returned on time so you can get on with your day.',
    image: unsplash('photo-1586528116311-ad8dd3c8310d', 600),
  },
];

export const FAQ_ITEMS = [
  {
    q: 'What areas do you serve?',
    a: 'We focus on local pickup and delivery within our service zone. Contact us with your address and we will confirm availability and the next slot.',
  },
  {
    q: 'How do pickups and deliveries work?',
    a: 'You choose a window that suits you. We collect at your door, process your items at our facility, and return them clean, packaged, and ready to use.',
  },
  {
    q: 'Are my clothes separated and labelled?',
    a: 'Yes. Items are tracked through each stage. Whites, colours, and delicates are separated appropriately, and special instructions are noted on your profile.',
  },
  {
    q: 'What if something is damaged or missing?',
    a: 'We take accountability seriously. Report any issue within 48 hours of delivery and our team will review and resolve it according to our care policy.',
  },
  {
    q: 'Do you use eco-friendly products?',
    a: 'We prioritise effective, gentler detergents and processes that reduce water and chemical waste where standards allow, without compromising results.',
  },
];

export const TESTIMONIALS = [
  {
    quote:
      'Consistent quality and the pickup saves me every week. Shirts come back pressed exactly how I need for client meetings.',
    name: 'Amara K.',
    role: 'Consultant',
  },
  {
    quote:
      'Bed linens and the kids’ school uniforms always smell fresh. Booking online is simple and reminders are helpful.',
    name: 'James T.',
    role: 'Parent of three',
  },
  {
    quote:
      'Dry cleaning for my event wear was flawless. Clear pricing and friendly drivers — I have already recommended Zicoclean.',
    name: 'Priya M.',
    role: 'Small business owner',
  },
];
