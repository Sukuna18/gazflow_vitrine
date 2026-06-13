import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  }

  return NextResponse.json(
    await prisma.order.findMany({
      include: { zone: true, items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  );
}
