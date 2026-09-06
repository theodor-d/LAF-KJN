import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ItemType } from "@prisma/client";
import { requireUser, canManageItems } from "@/lib/auth";
import { itemExpireDays } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { itemCreateSchema } from "@/lib/validators";

async function saveImage(file: File | null) {
  if (!file || file.size === 0) return null;

  const bytes = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const extension = path.extname(file.name) || ".jpg";
  const filename = `${Date.now()}-${crypto.randomUUID()}${extension}`;
  await writeFile(path.join(uploadDir, filename), bytes);
  return `/uploads/${filename}`;
}

export async function POST(request: NextRequest) {
  const user = await requireUser();
  const form = await request.formData();
  const parsed = itemCreateSchema.safeParse({
    type: form.get("type"),
    title: form.get("title"),
    quantity: form.get("quantity"),
    category: form.get("category"),
    location: form.get("location"),
    eventDate: form.get("eventDate"),
    description: form.get("description") || undefined,
    finderName: form.get("finderName") || undefined,
    finderCode: form.get("finderCode") || undefined
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.type === ItemType.FOUND && !canManageItems(user.role)) {
    return NextResponse.json({ error: "เฉพาะเจ้าหน้าที่หรือแอดมินเท่านั้นที่โพสต์ของที่เจอได้" }, { status: 403 });
  }

  const imageUrl = await saveImage(form.get("image") as File | null);
  await prisma.item.create({
    data: {
      ...parsed.data,
      imageUrl,
      expiresAt:
        parsed.data.type === ItemType.FOUND
          ? new Date(Date.now() + itemExpireDays * 24 * 60 * 60 * 1000)
          : null,
      createdById: user.id
    }
  });

  return NextResponse.redirect(new URL(parsed.data.type === ItemType.FOUND ? "/staff" : "/", request.url), {
    status: 303
  });
}
