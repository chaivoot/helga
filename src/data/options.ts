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

export const timelineSteps = [
  { title: 'ลูกสุนัข', desc: 'เรียนรู้การเข้าสังคมและฝึกพื้นฐาน' },
  {
    title: 'ช่วงเติบโต',
    desc: 'ดูแลโภชนาการ ออกกำลังกาย และฝึกต่อเนื่องกับครูฝึกโรงเรียนหมาสนุก',
  },
  { title: 'ก่อนเป็นแม่', desc: 'ตรวจสุขภาพตามมาตรฐาน และคัดเลือกพ่อพันธุ์ที่เหมาะสม' },
  { title: 'ครอกแรก', desc: '' },
];
