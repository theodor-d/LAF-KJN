import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reportSchema } from "@/lib/validators";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  const user = await requireUser();
  const { id } = await params;
  const form = await request.formData();
  const parsed = reportSchema.safeParse({ reason: form.get("reason") });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await prisma.report.create({
    data: {
      itemId: id,
      reporterId: user.id,
      reason: parsed.data.reason
    }
  });

  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
