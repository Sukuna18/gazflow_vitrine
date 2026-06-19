import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().min(1).max(500),
  content: z.string().min(1),
  coverImage: z.string().optional().nullable(),
  category: z.string().default("Actualites"),
  published: z.boolean().default(false),
});

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, slug: true, title: true, excerpt: true,
      coverImage: true, category: true, published: true,
      publishedAt: true, createdAt: true, updatedAt: true,
    },
  });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorise." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const result = createSchema.safeParse(body);
  if (!result.success) return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });

  const { published, ...data } = result.data;
  const post = await prisma.blogPost.create({
    data: {
      ...data,
      published,
      publishedAt: published ? new Date() : null,
    },
  });
  return NextResponse.json(post, { status: 201 });
}
