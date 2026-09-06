import { NextRequest, NextResponse } from "next/server";
import { ItemStatus } from "@prisma/client";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { statusUpdateSchema } from "@/lib/validators";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  const user = await requireRole(["STAFF", "ADMIN"]);
  const { id } = await params;
  const form = await request.formData();
  const parsed = statusUpdateSchema.safeParse({
    status: form.get("status"),
    receiverName: form.get("receiverName") || undefined,
    receiverEmail: form.get("receiverEmail") || undefined,
    receiverCode: form.get("receiverCode") || undefined,
    note: form.get("note") || undefined
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.status === ItemStatus.CLAIMED) {
    if (!parsed.data.receiverName) {
      return NextResponse.json({ error: "กรุณาระบุชื่อผู้รับของ" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.item.update({ where: { id }, data: { status: ItemStatus.CLAIMED } }),
      prisma.claimRecord.upsert({
        where: { itemId: id },
        update: {
          receiverName: parsed.data.receiverName,
          receiverEmail: parsed.data.receiverEmail || null,
          receiverCode: parsed.data.receiverCode,
          note: parsed.data.note,
          verifiedById: user.id
        },
        create: {
          itemId: id,
          receiverName: parsed.data.receiverName,
          receiverEmail: parsed.data.receiverEmail || null,
          receiverCode: parsed.data.receiverCode,
          note: parsed.data.note,
          verifiedById: user.id
        }
      })
    ]);
  } else {
    await prisma.item.update({ where: { id }, data: { status: parsed.data.status } });
  }

  return NextResponse.redirect(new URL("/staff", request.url), { status: 303 });
}
