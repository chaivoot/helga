import settings from '../content/settings/site.json';

/**
 * Site-wide settings. The editable part lives in
 * src/content/settings/site.json and is changed from /admin/settings.
 */
const digits = settings.contact.phone.replace(/[^\d+]/g, '');

export const site = {
  ...settings,
  breed: 'Shetland Sheepdog',
  contact: {
    ...settings.contact,
    lineUrl: settings.contact.lineUrl || '#',
    facebookUrl: settings.contact.facebookUrl || '#',
    phoneUrl: digits.length >= 9 ? `tel:${digits}` : '#',
  },
  /** Turn on once there are real customer reviews to show on the home page. */
  showReviews: false,
};

export type SiteSettings = typeof settings;

export type NavId = 'home' | 'puppies' | 'dogs' | 'sheltie' | 'journal' | 'contact';

export const nav: { id: NavId; label: string; href: string }[] = [
  { id: 'home', label: 'หน้าแรก', href: '/' },
  { id: 'puppies', label: 'ลูกสุนัข', href: '/puppies/' },
  { id: 'dogs', label: 'พ่อแม่พันธุ์', href: '/our-dogs/' },
  { id: 'sheltie', label: 'รู้จักเชลตี้', href: '/sheltie/' },
  { id: 'journal', label: 'บันทึกเฮลก้า', href: '/journal/' },
  { id: 'contact', label: 'ติดต่อ', href: '/contact/' },
];

/**
 * Whether slots that are meant for real photos (Helga, parents, partner
 * puppies, journal) show the temporary AI stand-ins. On by default so the
 * site can be presented as a complete sample. Set
 * PUBLIC_SHOW_TEMP_PHOTOS=false to show a striped "waiting for photo" slot
 * instead, e.g. for the public launch if real photos are not ready.
 */
export const showTempPhotos: boolean = import.meta.env.PUBLIC_SHOW_TEMP_PHOTOS !== 'false';
