import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: z.string().min(1).max(100).optional(),
  image: z.string().min(1).optional(),
  href: z.string().optional(),
  theme: z.enum(["light", "dark"]).optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const result = updateSchema.safeParse(body);
  if (!result.success) return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
  const partner = await prisma.partner.update({ where: { id: Number(id) }, data: result.data });
  return NextResponse.json(partner);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const { id } = await params;
  await prisma.partner.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
