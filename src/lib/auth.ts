import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { schoolDomain } from "@/lib/constants";

const cookieName = "lost_found_session";
const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-me-please-32-chars");

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export function isSchoolEmail(email: string) {
  return email.toLowerCase().endsWith(`@${schoolDomain.toLowerCase()}`);
}

export async function loginWithPassword(email: string, password: string) {
  if (!isSchoolEmail(email)) {
    throw new Error(`อนุญาตเฉพาะอีเมลโดเมน @${schoolDomain}`);
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  }

  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      id: String(payload.id),
      email: String(payload.email),
      name: String(payload.name),
      role: payload.role as Role
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(allowedRoles: Role[]) {
  const user = await requireUser();
  if (!allowedRoles.includes(user.role)) redirect("/");
  return user;
}

export function canManageItems(role: Role) {
  return role === "STAFF" || role === "ADMIN";
}
