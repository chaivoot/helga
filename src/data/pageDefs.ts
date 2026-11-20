/**
 * Describes the editable content of each public page: which fields exist and
 * how /admin labels them. The values live in src/content/pages/<id>.json.
 *
 * To make something new editable: add the field here, add its value to the
 * page's JSON file, and read it in the page.
 */

export interface TextField {
  name: string;
  label: string;
  type: 'text' | 'textarea';
  hint?: string;
}

export interface ImageField {
  name: string;
  label: string;
  type: 'image';
}

export type SimpleField = TextField | ImageField;

/** A repeatable group of fields; editors can add and remove items. */
export interface ListField {
  name: string;
  label: string;
  type: 'list';
  /** What one item is called, for the "add" button. */
  itemLabel: string;
  fields: SimpleField[];
}

export type Field = SimpleField | ListField;

export interface PageDef {
  id: string;
  title: string;
  /** Public URL of the page. */
  href: string;
  sections: { title: string; fields: Field[] }[];
}

export const pageDefs: PageDef[] = [
  {
    "id": "home",
    "title": "หน้าแรก",
    "href": "/",
    "sections": [
      {
        "title": "ส่วนบนสุด",
        "fields": [
          {
            "name": "heroBadge",
            "label": "ป้ายสถานะ",
            "type": "text"
          },
          {
            "name": "heroLead",
            "label": "ข้อความแนะนำ",
            "type": "textarea"
          },
          {
            "name": "heroImage",
            "label": "รูปเฮลก้า",
            "type": "image"
          },
          {
            "name": "heroTagTitle",
            "label": "ป้ายบนรูป บรรทัดบน",
            "type": "text"
          },
          {
            "name": "heroTagSub",
            "label": "ป้ายบนรูป บรรทัดล่าง",
            "type": "text"
          }
        ]
      },
      {
        "title": "แถบจุดเด่น",
        "fields": [
          {
            "name": "trust",
            "label": "จุดเด่น",
            "type": "list",
            "itemLabel": "จุดเด่น",
            "fields": [
              {
                "name": "text",
                "label": "ข้อความ",
                "type": "text"
              }
            ]
          }
        ]
      },
      {
        "title": "การ์ดทางลัด",
        "fields": [
          {
            "name": "entrySheltieImage",
            "label": "รูปการ์ด รู้จักเชลตี้",
            "type": "image"
          },
          {
            "name": "entryHelgaImage",
            "label": "รูปการ์ด พบกับเฮลก้า",
            "type": "image"
          },
          {
            "name": "entryProgramImage",
            "label": "รูปการ์ด โปรแกรมเตรียมความพร้อม",
            "type": "image"
          },
          {
            "name": "entryCtaTitle",
            "label": "การ์ดลงชื่อ หัวข้อ",
            "type": "text"
          },
          {
            "name": "entryCtaText",
            "label": "การ์ดลงชื่อ ข้อความ",
            "type": "text"
          }
        ]
      },
      {
        "title": "เกี่ยวกับเรา",
        "fields": [
          {
            "name": "aboutTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "aboutBody",
            "label": "เนื้อหา",
            "type": "textarea",
            "hint": "เว้นหนึ่งบรรทัดว่างเพื่อขึ้นย่อหน้าใหม่"
          },
          {
            "name": "aboutImage1",
            "label": "รูปที่ 1",
            "type": "image"
          },
          {
            "name": "aboutImage2",
            "label": "รูปที่ 2",
            "type": "image"
          }
        ]
      },
      {
        "title": "คำมั่นสัญญา",
        "fields": [
          {
            "name": "promisesTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "promises",
            "label": "คำมั่นสัญญา",
            "type": "list",
            "itemLabel": "ข้อ",
            "fields": [
              {
                "name": "title",
                "label": "หัวข้อ",
                "type": "text"
              },
              {
                "name": "text",
                "label": "รายละเอียด",
                "type": "textarea"
              }
            ]
          }
        ]
      },
      {
        "title": "เส้นทางของเฮลก้า",
        "fields": [
          {
            "name": "timelineTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "steps",
            "label": "ขั้นตอน",
            "type": "list",
            "itemLabel": "ขั้นตอน",
            "fields": [
              {
                "name": "title",
                "label": "ชื่อช่วง",
                "type": "text"
              },
              {
                "name": "desc",
                "label": "รายละเอียด",
                "type": "textarea"
              }
            ]
          }
        ]
      },
      {
        "title": "แถวรูปเฮลก้า",
        "fields": [
          {
            "name": "helgaPhotos",
            "label": "รูป",
            "type": "list",
            "itemLabel": "รูป",
            "fields": [
              {
                "name": "image",
                "label": "รูป",
                "type": "image"
              }
            ]
          }
        ]
      },
      {
        "title": "หัวข้อส่วนอื่น",
        "fields": [
          {
            "name": "journalTitle",
            "label": "ส่วนบันทึกเฮลก้า",
            "type": "text"
          },
          {
            "name": "knowledgeTitle",
            "label": "ส่วนความรู้",
            "type": "text"
          }
        ]
      },
      {
        "title": "แถบชวนท้ายหน้า",
        "fields": [
          {
            "name": "ctaTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "ctaText",
            "label": "ข้อความ",
            "type": "textarea"
          }
        ]
      }
    ]
  },
  {
    "id": "puppies",
    "title": "ลูกสุนัข (ลงชื่อรอครอกแรก)",
    "href": "/puppies/",
    "sections": [
      {
        "title": "ส่วนบนสุด",
        "fields": [
          {
            "name": "title",
            "label": "หัวข้อหน้า",
            "type": "text"
          },
          {
            "name": "lead",
            "label": "ข้อความแนะนำ",
            "type": "textarea"
          }
        ]
      },
      {
        "title": "กล่องสถานะ",
        "fields": [
          {
            "name": "statusImage",
            "label": "รูปเฮลก้า",
            "type": "image"
          },
          {
            "name": "statusTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "statusText",
            "label": "ข้อความ",
            "type": "text"
          },
          {
            "name": "sireStatus",
            "label": "พ่อพันธุ์",
            "type": "text"
          }
        ]
      },
      {
        "title": "สิ่งที่ลูกสุนัขจะได้รับ",
        "fields": [
          {
            "name": "getsTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "gets",
            "label": "รายการ",
            "type": "list",
            "itemLabel": "ข้อ",
            "fields": [
              {
                "name": "text",
                "label": "ข้อความ",
                "type": "text"
              }
            ]
          }
        ]
      },
      {
        "title": "ลงชื่อรอครอกแรก (ทาง LINE)",
        "fields": [
          {
            "name": "waitlistTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "waitlistNote",
            "label": "คำอธิบาย",
            "type": "textarea"
          },
          {
            "name": "waitlistAskTitle",
            "label": "หัวข้อรายการ",
            "type": "text"
          },
          {
            "name": "waitlistAsk",
            "label": "สิ่งที่ให้บอกใน LINE",
            "type": "list",
            "itemLabel": "ข้อ",
            "fields": [
              {
                "name": "text",
                "label": "ข้อความ",
                "type": "text"
              }
            ]
          },
          {
            "name": "waitlistAction",
            "label": "ข้อความบนปุ่ม",
            "type": "text"
          }
        ]
      },
      {
        "title": "แถบชวนท้ายหน้า",
        "fields": [
          {
            "name": "bannerTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "bannerText",
            "label": "ข้อความ",
            "type": "text"
          }
        ]
      }
    ]
  },
  {
    "id": "partners",
    "title": "ลูกเชลตี้จากฟาร์มพันธมิตร",
    "href": "/puppies/partners/",
    "sections": [
      {
        "title": "ส่วนบนสุด",
        "fields": [
          {
            "name": "title",
            "label": "หัวข้อหน้า",
            "type": "text"
          },
          {
            "name": "lead",
            "label": "ข้อความแนะนำ",
            "type": "textarea"
          },
          {
            "name": "note",
            "label": "หมายเหตุ",
            "type": "textarea"
          }
        ]
      },
      {
        "title": "มาตรฐานพันธมิตร",
        "fields": [
          {
            "name": "standardsTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "standards",
            "label": "มาตรฐาน",
            "type": "list",
            "itemLabel": "ข้อ",
            "fields": [
              {
                "name": "text",
                "label": "ข้อความ",
                "type": "text"
              }
            ]
          }
        ]
      },
      {
        "title": "รายการลูกสุนัข",
        "fields": [
          {
            "name": "listTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "emptyTitle",
            "label": "เมื่อไม่มีลูกสุนัข หัวข้อ",
            "type": "text"
          },
          {
            "name": "emptyText",
            "label": "เมื่อไม่มีลูกสุนัข ข้อความ",
            "type": "text"
          }
        ]
      },
      {
        "title": "แถบชวนท้ายหน้า",
        "fields": [
          {
            "name": "bannerTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "bannerText",
            "label": "ข้อความ",
            "type": "text"
          }
        ]
      }
    ]
  },
  {
    "id": "program",
    "title": "โปรแกรมเตรียมความพร้อม",
    "href": "/puppies/program/",
    "sections": [
      {
        "title": "ส่วนบนสุด",
        "fields": [
          {
            "name": "title",
            "label": "หัวข้อหน้า",
            "type": "text"
          },
          {
            "name": "lead",
            "label": "ข้อความแนะนำ",
            "type": "textarea"
          },
          {
            "name": "heroImage",
            "label": "รูป",
            "type": "image"
          }
        ]
      },
      {
        "title": "สิ่งที่ลูกสุนัขจะได้เรียนรู้",
        "fields": [
          {
            "name": "lessonsTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "lessons",
            "label": "เรื่อง",
            "type": "list",
            "itemLabel": "เรื่อง",
            "fields": [
              {
                "name": "title",
                "label": "หัวข้อ",
                "type": "text"
              },
              {
                "name": "text",
                "label": "รายละเอียด",
                "type": "textarea"
              }
            ]
          }
        ]
      },
      {
        "title": "แถบชวนท้ายหน้า",
        "fields": [
          {
            "name": "bannerTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "bannerText",
            "label": "ข้อความ",
            "type": "text"
          }
        ]
      }
    ]
  },
  {
    "id": "dogs",
    "title": "พ่อแม่พันธุ์",
    "href": "/our-dogs/",
    "sections": [
      {
        "title": "ส่วนบนสุด",
        "fields": [
          {
            "name": "title",
            "label": "หัวข้อหน้า",
            "type": "text"
          },
          {
            "name": "lead",
            "label": "ข้อความแนะนำ",
            "type": "textarea"
          }
        ]
      },
      {
        "title": "โปรไฟล์เฮลก้า",
        "fields": [
          {
            "name": "helgaImage",
            "label": "รูปเฮลก้า",
            "type": "image"
          },
          {
            "name": "helgaName",
            "label": "ชื่อ",
            "type": "text"
          },
          {
            "name": "helgaNameTh",
            "label": "ชื่อภาษาไทย",
            "type": "text"
          },
          {
            "name": "helgaSub",
            "label": "คำบรรยายใต้ชื่อ",
            "type": "text"
          },
          {
            "name": "helgaSex",
            "label": "เพศ",
            "type": "text"
          },
          {
            "name": "helgaColor",
            "label": "สี",
            "type": "text"
          },
          {
            "name": "parents",
            "label": "สายเลือด",
            "type": "list",
            "itemLabel": "รายการ",
            "fields": [
              {
                "name": "role",
                "label": "พ่อ / แม่",
                "type": "text"
              },
              {
                "name": "text",
                "label": "รายละเอียด",
                "type": "textarea"
              }
            ]
          }
        ]
      },
      {
        "title": "เฮลก้าตามช่วงอายุ",
        "fields": [
          {
            "name": "agesTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "ages",
            "label": "รูปตามช่วงอายุ",
            "type": "list",
            "itemLabel": "รูป",
            "fields": [
              {
                "name": "image",
                "label": "รูป",
                "type": "image"
              },
              {
                "name": "caption",
                "label": "อายุ",
                "type": "text"
              }
            ]
          }
        ]
      },
      {
        "title": "พ่อพันธุ์",
        "fields": [
          {
            "name": "sireTitle",
            "label": "หัวข้อส่วน",
            "type": "text"
          },
          {
            "name": "sireHeading",
            "label": "หัวข้อการ์ด",
            "type": "text"
          },
          {
            "name": "sireText",
            "label": "ข้อความ",
            "type": "textarea"
          }
        ]
      }
    ]
  },
  {
    "id": "sheltie",
    "title": "รู้จักเชลตี้",
    "href": "/sheltie/",
    "sections": [
      {
        "title": "ส่วนบนสุด",
        "fields": [
          {
            "name": "title",
            "label": "หัวข้อหน้า",
            "type": "text"
          },
          {
            "name": "lead",
            "label": "ข้อความแนะนำ",
            "type": "textarea"
          },
          {
            "name": "heroImage",
            "label": "รูป",
            "type": "image"
          }
        ]
      },
      {
        "title": "ต้นกำเนิด",
        "fields": [
          {
            "name": "originTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "originBody",
            "label": "เนื้อหา",
            "type": "textarea",
            "hint": "เว้นหนึ่งบรรทัดว่างเพื่อขึ้นย่อหน้าใหม่"
          }
        ]
      },
      {
        "title": "ข้อมูลโดยย่อ",
        "fields": [
          {
            "name": "factsTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "facts",
            "label": "ข้อมูล",
            "type": "list",
            "itemLabel": "ข้อ",
            "fields": [
              {
                "name": "label",
                "label": "หัวข้อ",
                "type": "text"
              },
              {
                "name": "value",
                "label": "ค่า",
                "type": "text"
              }
            ]
          }
        ]
      },
      {
        "title": "ถูกสร้างมาเพื่ออะไร",
        "fields": [
          {
            "name": "builtTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "builtBody",
            "label": "เนื้อหา",
            "type": "textarea",
            "hint": "เว้นหนึ่งบรรทัดว่างเพื่อขึ้นย่อหน้าใหม่"
          },
          {
            "name": "jobs",
            "label": "รูปประกอบ",
            "type": "list",
            "itemLabel": "รูป",
            "fields": [
              {
                "name": "image",
                "label": "รูป",
                "type": "image"
              },
              {
                "name": "caption",
                "label": "คำบรรยาย",
                "type": "text"
              }
            ]
          }
        ]
      },
      {
        "title": "นิสัย",
        "fields": [
          {
            "name": "temperTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "temperBody",
            "label": "เนื้อหา",
            "type": "textarea",
            "hint": "เว้นหนึ่งบรรทัดว่างเพื่อขึ้นย่อหน้าใหม่"
          },
          {
            "name": "knowTitle",
            "label": "หัวข้อย่อย",
            "type": "text"
          },
          {
            "name": "know",
            "label": "สิ่งที่ควรรู้",
            "type": "list",
            "itemLabel": "ข้อ",
            "fields": [
              {
                "name": "title",
                "label": "หัวข้อ",
                "type": "text"
              },
              {
                "name": "text",
                "label": "รายละเอียด",
                "type": "textarea"
              }
            ]
          }
        ]
      },
      {
        "title": "เหมาะกับใคร",
        "fields": [
          {
            "name": "suitsTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "suitsBody",
            "label": "เนื้อหา",
            "type": "textarea",
            "hint": "เว้นหนึ่งบรรทัดว่างเพื่อขึ้นย่อหน้าใหม่"
          },
          {
            "name": "suitsImage1",
            "label": "รูปที่ 1",
            "type": "image"
          },
          {
            "name": "suitsImage2",
            "label": "รูปที่ 2",
            "type": "image"
          }
        ]
      }
    ]
  },
  {
    "id": "health",
    "title": "สุขภาพเชลตี้",
    "href": "/sheltie/health/",
    "sections": [
      {
        "title": "ส่วนบนสุด",
        "fields": [
          {
            "name": "title",
            "label": "หัวข้อหน้า",
            "type": "text"
          },
          {
            "name": "lead",
            "label": "ข้อความแนะนำ",
            "type": "textarea"
          },
          {
            "name": "heroImage",
            "label": "รูป",
            "type": "image"
          }
        ]
      },
      {
        "title": "โรคทางพันธุกรรม",
        "fields": [
          {
            "name": "conditionsTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "conditions",
            "label": "โรค",
            "type": "list",
            "itemLabel": "โรค",
            "fields": [
              {
                "name": "title",
                "label": "ชื่อ",
                "type": "text"
              },
              {
                "name": "body",
                "label": "คำอธิบาย",
                "type": "textarea"
              }
            ]
          }
        ]
      },
      {
        "title": "สิ่งที่เราทำ",
        "fields": [
          {
            "name": "oursTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "oursBody",
            "label": "เนื้อหา",
            "type": "textarea",
            "hint": "เว้นหนึ่งบรรทัดว่างเพื่อขึ้นย่อหน้าใหม่"
          },
          {
            "name": "disclaimer",
            "label": "ข้อความท้ายหน้า",
            "type": "textarea"
          }
        ]
      }
    ]
  },
  {
    "id": "colors",
    "title": "สีเชลตี้",
    "href": "/sheltie/colors/",
    "sections": [
      {
        "title": "ส่วนบนสุด",
        "fields": [
          {
            "name": "title",
            "label": "หัวข้อหน้า",
            "type": "text"
          },
          {
            "name": "lead",
            "label": "ข้อความแนะนำ",
            "type": "textarea"
          },
          {
            "name": "note",
            "label": "หมายเหตุ",
            "type": "text"
          }
        ]
      },
      {
        "title": "สีหลัก",
        "fields": [
          {
            "name": "colors",
            "label": "สี",
            "type": "list",
            "itemLabel": "สี",
            "fields": [
              {
                "name": "name",
                "label": "ชื่อสี",
                "type": "text"
              },
              {
                "name": "english",
                "label": "ชื่อภาษาอังกฤษ",
                "type": "text"
              },
              {
                "name": "image",
                "label": "รูป",
                "type": "image"
              },
              {
                "name": "text",
                "label": "คำอธิบาย",
                "type": "textarea"
              }
            ]
          }
        ]
      },
      {
        "title": "สีตอนเป็นลูกสุนัข",
        "fields": [
          {
            "name": "pupsTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "pupsBody",
            "label": "เนื้อหา",
            "type": "textarea",
            "hint": "เว้นหนึ่งบรรทัดว่างเพื่อขึ้นย่อหน้าใหม่"
          },
          {
            "name": "pupColors",
            "label": "รูปลูกสุนัข",
            "type": "list",
            "itemLabel": "รูป",
            "fields": [
              {
                "name": "image",
                "label": "รูป",
                "type": "image"
              },
              {
                "name": "caption",
                "label": "คำบรรยาย",
                "type": "text"
              }
            ]
          }
        ]
      },
      {
        "title": "สีอื่นๆ",
        "fields": [
          {
            "name": "othersTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "others",
            "label": "สี",
            "type": "list",
            "itemLabel": "สี",
            "fields": [
              {
                "name": "name",
                "label": "ชื่อสี",
                "type": "text"
              },
              {
                "name": "english",
                "label": "ชื่อภาษาอังกฤษ",
                "type": "text"
              },
              {
                "name": "image",
                "label": "รูป",
                "type": "image"
              },
              {
                "name": "text",
                "label": "คำอธิบาย",
                "type": "textarea"
              }
            ]
          }
        ]
      },
      {
        "title": "แถบชวนท้ายหน้า",
        "fields": [
          {
            "name": "bannerTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "bannerText",
            "label": "ข้อความ",
            "type": "text"
          }
        ]
      }
    ]
  },
  {
    "id": "journal",
    "title": "บันทึกเฮลก้า (หน้ารวม)",
    "href": "/journal/",
    "sections": [
      {
        "title": "ส่วนบนสุด",
        "fields": [
          {
            "name": "title",
            "label": "หัวข้อหน้า",
            "type": "text"
          },
          {
            "name": "lead",
            "label": "ข้อความแนะนำ",
            "type": "textarea"
          }
        ]
      },
      {
        "title": "แถบชวนท้ายหน้า",
        "fields": [
          {
            "name": "bannerTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "bannerText",
            "label": "ข้อความ",
            "type": "text"
          }
        ]
      }
    ]
  },
  {
    "id": "contact",
    "title": "ติดต่อเรา",
    "href": "/contact/",
    "sections": [
      {
        "title": "ส่วนบนสุด",
        "fields": [
          {
            "name": "title",
            "label": "หัวข้อหน้า",
            "type": "text"
          },
          {
            "name": "lead",
            "label": "ข้อความแนะนำ",
            "type": "textarea"
          }
        ]
      },
      {
        "title": "การ์ด LINE",
        "fields": [
          {
            "name": "lineTitle",
            "label": "หัวข้อ",
            "type": "text"
          },
          {
            "name": "lineText",
            "label": "ข้อความ",
            "type": "textarea"
          },
          {
            "name": "lineAction",
            "label": "ข้อความบนปุ่ม",
            "type": "text"
          }
        ]
      }
    ]
  }
];

export const getPageDef = (id: string) => pageDefs.find((page) => page.id === id);
