import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";

const extensions = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const imageSchema = z.instanceof(File)
  .refine((file) => extensions.has(file.type), "Formats acceptes : JPG, PNG ou WEBP.")
  .refine((file) => file.size <= 5 * 1024 * 1024, "L'image ne doit pas depasser 5 Mo.");

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const formData = await request.formData();
  const result = imageSchema.safeParse(formData.get("file"));
  if (!result.success) return NextResponse.json({ error: result.error.issues[0]?.message ?? "Selectionnez une image." }, { status: 400 });
  const file = result.data;
  const extension = extensions.get(file.type)!;

  const directory = path.join(process.cwd(), "public", "uploads", "products");
  const filename = `${randomUUID()}.${extension}`;
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ path: `/uploads/products/${filename}` }, { status: 201 });
}
