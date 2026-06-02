import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const sessionAdmin = await currentAdmin();
  if (!sessionAdmin) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const id = Number((await params).id);
  if (id === sessionAdmin.id) return NextResponse.json({ error: "Vous ne pouvez pas supprimer votre propre compte." }, { status: 400 });
  if (await prisma.admin.count({ where: { active: true } }) <= 1) {
    return NextResponse.json({ error: "Le dernier administrateur actif ne peut pas etre supprime." }, { status: 400 });
  }
  await prisma.admin.delete({ where: { id } });
  return NextResponse.json({ id });
}
