import { NextRequest, NextResponse } from "next/server";
import { loginWithPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");

  try {
    await loginWithPassword(email, password);
    return NextResponse.redirect(new URL("/", request.url), { status: 303 });
  } catch (error) {
    const message = encodeURIComponent(error instanceof Error ? error.message : "เข้าสู่ระบบไม่สำเร็จ");
    return NextResponse.redirect(new URL(`/login?error=${message}`, request.url), { status: 303 });
  }
}
