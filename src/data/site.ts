/**
 * Site-wide settings. The brand name and contact details are not final yet:
 * change them here and every page picks them up.
 */
export const site = {
  name: 'Helga House',
  nameTh: 'บ้านเชลตี้ เฮลก้าเฮาส์',
  breed: 'Shetland Sheepdog',
  contact: {
    line: '[ ]',
    lineUrl: '#',
    facebook: '[ ]',
    facebookUrl: '#',
    phone: '[ ]',
    phoneUrl: '#',
    area: '[ ]',
    bankAccountName: '[ชื่อบัญชีที่ถูกต้อง]',
  },
  /** Where Helga is on the home page timeline (1-4). */
  currentStep: 1,
  /** Turn on once there are real customer reviews to show on the home page. */
  showReviews: false,
  /** Partner puppy cards: 'ask' shows "ทักถามราคา", 'show' shows each price. */
  partnerPriceMode: 'ask' as 'ask' | 'show',
};

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
