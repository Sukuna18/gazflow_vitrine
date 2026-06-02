import { OrderStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const id = Number((await params).id);
  const { status } = (await request.json()) as { status?: OrderStatus };
  if (!status || !Object.values(OrderStatus).includes(status)) return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  return NextResponse.json(await prisma.order.update({ where: { id }, data: { status } }));
}
