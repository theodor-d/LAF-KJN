import { NextResponse } from "next/server";
import { ItemStatus, ItemType } from "@prisma/client";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  await requireRole(["STAFF", "ADMIN"]);
  const result = await prisma.item.updateMany({
    where: {
      type: ItemType.FOUND,
      status: ItemStatus.FOUND,
      expiresAt: { lt: new Date() }
    },
    data: { status: ItemStatus.EXPIRED }
  });

  return NextResponse.json({ expired: result.count });
}
