import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Payload = { slug?: string; name?: string; category?: string; description?: string; price?: number; stock?: number; weight?: string; image?: string; featured?: boolean; active?: boolean };

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const body = (await request.json()) as Payload;
  if (!body.slug?.trim() || !body.name?.trim() || !body.category?.trim() || !body.description?.trim() || !body.image?.trim() || !Number.isInteger(body.price) || body.price! < 0 || !Number.isInteger(body.stock) || body.stock! < 0) {
    return NextResponse.json({ error: "Veuillez renseigner les champs obligatoires." }, { status: 400 });
  }
  const sortOrder = await prisma.product.count();
  return NextResponse.json(await prisma.product.create({ data: { slug: body.slug.trim(), name: body.name.trim(), category: body.category.trim(), description: body.description.trim(), image: body.image.trim(), weight: body.weight?.trim() || null, price: body.price!, stock: body.stock!, featured: body.featured ?? false, active: body.active ?? true, sortOrder } }), { status: 201 });
}
