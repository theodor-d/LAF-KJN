import { Category, ItemStatus, ItemType, Role } from "@prisma/client";

export const schoolDomain = process.env.SCHOOL_EMAIL_DOMAIN ?? "kjn.ac.th";
export const itemExpireDays = Number(process.env.ITEM_EXPIRE_DAYS ?? "30");

export const roleLabels: Record<Role, string> = {
  STUDENT: "นักเรียน",
  TEACHER: "ครูทั่วไป",
  STAFF: "เจ้าหน้าที่ประชาสัมพันธ์",
  ADMIN: "แอดมิน"
};

export const itemTypeLabels: Record<ItemType, string> = {
  FOUND: "ของที่เจอ",
  LOST: "ตามหาของหาย"
};

export const itemStatusLabels: Record<ItemStatus, string> = {
  FOUND: "รอเจ้าของ",
  CLAIMED: "รับคืนแล้ว",
  EXPIRED: "หมดอายุ",
  DONATED: "บริจาคแล้ว"
};

export const categoryLabels: Record<Category, string> = {
  BAG: "กระเป๋า",
  CLOTHING: "เสื้อผ้า",
  STATIONERY: "อุปกรณ์การเรียน",
  ELECTRONIC: "อิเล็กทรอนิกส์",
  DOCUMENT: "เอกสาร",
  MONEY: "เงิน/ทรัพย์สินมีค่า",
  KEY: "กุญแจ",
  OTHER: "อื่น ๆ"
};

export const locations = [
  "อาคาร 1",
  "อาคาร 2",
  "ห้องสมุด",
  "โรงอาหาร",
  "สนามฟุตบอล",
  "สนามบาส",
  "หอประชุม",
  "หน้าประตูโรงเรียน"
];
