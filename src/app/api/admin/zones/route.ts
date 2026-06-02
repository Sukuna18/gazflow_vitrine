import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const { name, fee, eta } = (await request.json()) as { name?: string; fee?: number; eta?: string };
  if (!name?.trim() || !eta?.trim() || !Number.isInteger(fee) || fee! < 0) return NextResponse.json({ error: "Zone invalide." }, { status: 400 });
  return NextResponse.json(await prisma.deliveryZone.create({ data: { name: name.trim(), fee: fee!, eta: eta.trim() } }), { status: 201 });
}
