import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const id = Number((await params).id);
  const { name, fee, eta } = (await request.json()) as { name?: string; fee?: number; eta?: string };
  return NextResponse.json(await prisma.deliveryZone.update({ where: { id }, data: { ...(name?.trim() ? { name: name.trim() } : {}), ...(eta?.trim() ? { eta: eta.trim() } : {}), ...(Number.isInteger(fee) && fee! >= 0 ? { fee } : {}) } }));
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const id = Number((await params).id);
  const orders = await prisma.order.count({ where: { zoneId: id } });
  if (orders) return NextResponse.json({ error: "Cette zone est liee a des commandes." }, { status: 409 });
  return NextResponse.json(await prisma.deliveryZone.delete({ where: { id } }));
}
