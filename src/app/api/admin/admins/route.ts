import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const { name, email, password } = (await request.json()) as { name?: string; email?: string; password?: string };
  if (!name?.trim() || !email?.trim() || !password || password.length < 8) {
    return NextResponse.json({ error: "Renseignez un nom, un email et un mot de passe de 8 caracteres minimum." }, { status: 400 });
  }
  try {
    const admin = await prisma.admin.create({
      data: { name: name.trim(), email: email.trim().toLowerCase(), passwordHash: hashPassword(password) },
      select: { id: true, name: true, email: true, active: true, createdAt: true },
    });
    return NextResponse.json(admin, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Cet email est deja utilise." }, { status: 409 });
  }
}
