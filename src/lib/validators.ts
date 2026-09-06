import { Category, ItemStatus, ItemType } from "@prisma/client";
import { z } from "zod";

export const itemCreateSchema = z.object({
  type: z.nativeEnum(ItemType),
  title: z.string().min(2, "กรุณาระบุชื่อสิ่งของ"),
  quantity: z.coerce.number().int().min(1).max(99),
  category: z.nativeEnum(Category),
  location: z.string().min(2),
  eventDate: z.coerce.date(),
  description: z.string().max(1000).optional(),
  finderName: z.string().optional(),
  finderCode: z.string().optional()
});

export const statusUpdateSchema = z.object({
  status: z.nativeEnum(ItemStatus),
  receiverName: z.string().optional(),
  receiverEmail: z.string().email().optional().or(z.literal("")),
  receiverCode: z.string().optional(),
  note: z.string().optional()
});

export const reportSchema = z.object({
  reason: z.string().min(5).max(500)
});
