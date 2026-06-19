import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.string().min(1).max(100),
  image: z.string().min(1),
  href: z.string().default(""),
  theme: z.enum(["light", "dark"]).default("light"),
  active: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const partners = await prisma.partner.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(partners);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const result = createSchema.safeParse(body);
  if (!result.success) return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
  const partner = await prisma.partner.create({ data: result.data });
  return NextResponse.json(partner, { status: 201 });
}
