import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { zonePatchSchema } from "@/lib/validations/zone";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const id = Number((await params).id);
  const result = zonePatchSchema.safeParse(await request.json());
  if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  return NextResponse.json(await prisma.deliveryZone.update({ where: { id }, data: result.data }));
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const id = Number((await params).id);
  const orders = await prisma.order.count({ where: { zoneId: id } });
  if (orders) return NextResponse.json({ error: "Cette zone est liee a des commandes." }, { status: 409 });
  return NextResponse.json(await prisma.deliveryZone.delete({ where: { id } }));
}
