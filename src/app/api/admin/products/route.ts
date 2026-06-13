import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";

export async function GET() {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  return NextResponse.json(
    await prisma.product.findMany({ orderBy: { sortOrder: "asc" } }),
  );
}

export async function POST(request: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const result = productSchema.safeParse(await request.json());
  if (!result.success)
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 },
    );
  const body = result.data;
  const sortOrder = await prisma.product.count();
  return NextResponse.json(
    await prisma.product.create({
      data: { ...body, weight: body.weight || null, sortOrder },
    }),
    { status: 201 },
  );
}
