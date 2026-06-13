import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { settingsPatchSchema } from "@/lib/validations/settings";

export async function GET() {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  return NextResponse.json(
    await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    }),
  );
}

export async function PATCH(request: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const result = settingsPatchSchema.safeParse(await request.json());
  if (!result.success)
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 },
    );
  const data = result.data;
  return NextResponse.json(
    await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    }),
  );
}
