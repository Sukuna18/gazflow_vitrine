import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/login";

function secureCookie(request: Request) {
  if (process.env.COOKIE_SECURE === "true") return true;
  if (process.env.COOKIE_SECURE === "false") return false;
  return request.headers.get("x-forwarded-proto") === "https" || new URL(request.url).protocol === "https:";
}

export async function POST(request: Request) {
  const result = loginSchema.safeParse(await request.json());
  if (!result.success) return NextResponse.json({ error: "Email ou mot de passe incorrect." }, { status: 401 });
  const { email, password } = result.data;
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin?.active || !verifyPassword(password, admin.passwordHash)) {
    return NextResponse.json({ error: "Email ou mot de passe incorrect." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, adminToken(admin.id), { httpOnly: true, sameSite: "strict", secure: secureCookie(request), path: "/", maxAge: 60 * 60 * 12 });
  return response;
}
