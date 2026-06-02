import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { adminSchema } from "@/lib/validations/admin";

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const result = adminSchema.safeParse(await request.json());
  if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  const { name, email, password } = result.data;
  try {
    const admin = await prisma.admin.create({
      data: { name, email, passwordHash: hashPassword(password) },
      select: { id: true, name: true, email: true, active: true, createdAt: true },
    });
    return NextResponse.json(admin, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Cet email est deja utilise." }, { status: 409 });
  }
}
