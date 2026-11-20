import type { ImageMetadata } from 'astro';
import { images } from './images';

export type PuppyStatus = 'available' | 'reserved' | 'delivered';

export const statusLabels: Record<PuppyStatus, string> = {
  available: 'ว่าง',
  reserved: 'จองแล้ว',
  delivered: 'ส่งมอบแล้ว',
};

export interface PartnerPuppy {
  status: PuppyStatus;
  farm: string;
  sex: string;
  color: string;
  born: string;
  sire: string;
  dam: string;
  /** Shown only when site.partnerPriceMode is 'show'. */
  price: string;
  photo: ImageMetadata;
  /** True while `photo` is a temporary AI image standing in for a real one. */
  tempPhoto?: boolean;
}

const placeholder = {
  farm: '[ชื่อฟาร์มพันธมิตร]',
  sex: '[ ]',
  color: '[ ]',
  born: '[ ]',
  sire: '[ชื่อพ่อ]',
  dam: '[ชื่อแม่]',
  price: '[ราคา] บาท',
  tempPhoto: true,
};

/** Placeholder listings: replace with real partner puppies (or leave empty). */
export const partnerPuppies: PartnerPuppy[] = [
  { ...placeholder, status: 'available', photo: images.sablePupTile },
  { ...placeholder, status: 'reserved', photo: images.biblackPupTile },
  { ...placeholder, status: 'delivered', photo: images.triPupPatio },
];
