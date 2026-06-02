import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const fields = ["phoneDisplay", "phoneHref", "address", "heroEyebrow", "heroTitle", "heroAccent", "heroDescription", "announcementOne", "announcementTwo", "announcementThree", "contactTitle", "contactDescription"] as const;

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const body = (await request.json()) as Record<string, unknown>;
  const data = Object.fromEntries(fields.flatMap((field) => typeof body[field] === "string" && body[field].trim() ? [[field, body[field].trim()]] : []));
  return NextResponse.json(await prisma.siteSettings.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } }));
}
