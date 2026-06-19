import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) return NextResponse.json({ error: "ID invalide." }, { status: 400 });
  const post = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!post) return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
  return NextResponse.json(post);
}

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/).optional(),
  excerpt: z.string().min(1).max(500).optional(),
  content: z.string().min(1).optional(),
  coverImage: z.string().optional().nullable(),
  category: z.string().optional(),
  published: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) return NextResponse.json({ error: "ID invalide." }, { status: 400 });

  const body = await request.json().catch(() => null);
  const result = updateSchema.safeParse(body);
  if (!result.success) return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });

  const existing = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!existing) return NextResponse.json({ error: "Article introuvable." }, { status: 404 });

  const { published, ...data } = result.data;
  const wasDraft = !existing.published;
  const nowPublished = published === true;

  const post = await prisma.blogPost.update({
    where: { id: postId },
    data: {
      ...data,
      ...(published !== undefined && { published }),
      ...(wasDraft && nowPublished && { publishedAt: new Date() }),
      ...(published === false && { publishedAt: null }),
    },
  });
  return NextResponse.json(post);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) return NextResponse.json({ error: "ID invalide." }, { status: 400 });
  await prisma.blogPost.delete({ where: { id: postId } });
  return NextResponse.json({ ok: true });
}
