/** Fixed choices shared by the content schema, the public pages and /admin. */

export const journalCategories = ['การกิน', 'การฝึก', 'สุขภาพ', 'ขน', 'ชีวิตประจำวัน'] as const;
export type JournalCategory = (typeof journalCategories)[number];

export const puppyStatuses = ['available', 'reserved', 'delivered'] as const;
export type PuppyStatus = (typeof puppyStatuses)[number];

export const statusLabels: Record<PuppyStatus, string> = {
  available: 'ว่าง',
  reserved: 'จองแล้ว',
  delivered: 'ส่งมอบแล้ว',
};
