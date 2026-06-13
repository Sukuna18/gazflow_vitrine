import { unlink } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productPatchSchema } from "@/lib/validations/product";

async function deleteUploadedImage(imagePath: string) {
  if (!imagePath.startsWith("/uploads/products/")) return;
  const filename = path.basename(imagePath);
  const uploadDir = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "public", "uploads", "products");
  try { await unlink(path.join(uploadDir, filename)); } catch {}
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const id = Number((await params).id);
  const result = productPatchSchema.safeParse(await request.json());
  if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  const data = { ...result.data, ...(result.data.weight !== undefined ? { weight: result.data.weight || null } : {}) };
  if (data.image) {
    const current = await prisma.product.findUnique({ where: { id }, select: { image: true } });
    if (current?.image && current.image !== data.image) await deleteUploadedImage(current.image);
  }
  return NextResponse.json(await prisma.product.update({ where: { id }, data }));
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const id = Number((await params).id);
  return NextResponse.json(await prisma.product.update({ where: { id }, data: { active: false } }));
}
