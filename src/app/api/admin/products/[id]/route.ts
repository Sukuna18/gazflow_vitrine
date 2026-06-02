import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const id = Number((await params).id);
  const body = (await request.json()) as { slug?: string; name?: string; category?: string; description?: string; image?: string; weight?: string | null; active?: boolean; featured?: boolean; stock?: number; price?: number };
  const data = {
    ...(typeof body.slug === "string" && body.slug.trim() ? { slug: body.slug.trim() } : {}),
    ...(typeof body.name === "string" && body.name.trim() ? { name: body.name.trim() } : {}),
    ...(typeof body.category === "string" && body.category.trim() ? { category: body.category.trim() } : {}),
    ...(typeof body.description === "string" && body.description.trim() ? { description: body.description.trim() } : {}),
    ...(typeof body.image === "string" && body.image.trim() ? { image: body.image.trim() } : {}),
    ...(typeof body.weight === "string" || body.weight === null ? { weight: body.weight?.trim() || null } : {}),
    ...(typeof body.active === "boolean" ? { active: body.active } : {}),
    ...(typeof body.featured === "boolean" ? { featured: body.featured } : {}),
    ...(Number.isInteger(body.stock) && body.stock! >= 0 ? { stock: body.stock } : {}),
    ...(Number.isInteger(body.price) && body.price! >= 0 ? { price: body.price } : {}),
  };
  return NextResponse.json(await prisma.product.update({ where: { id }, data }));
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const id = Number((await params).id);
  return NextResponse.json(await prisma.product.update({ where: { id }, data: { active: false } }));
}
