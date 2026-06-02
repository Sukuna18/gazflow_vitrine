import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productPatchSchema } from "@/lib/validations/product";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const id = Number((await params).id);
  const result = productPatchSchema.safeParse(await request.json());
  if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  const data = { ...result.data, ...(result.data.weight !== undefined ? { weight: result.data.weight || null } : {}) };
  return NextResponse.json(await prisma.product.update({ where: { id }, data }));
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const id = Number((await params).id);
  return NextResponse.json(await prisma.product.update({ where: { id }, data: { active: false } }));
}
