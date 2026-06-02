import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { zoneSchema } from "@/lib/validations/zone";

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const result = zoneSchema.safeParse(await request.json());
  if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  return NextResponse.json(await prisma.deliveryZone.create({ data: result.data }), { status: 201 });
}
