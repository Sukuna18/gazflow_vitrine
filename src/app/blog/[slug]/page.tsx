import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, ChevronRight, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import BrandLogo from "@/components/BrandLogo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
    select: { title: true, excerpt: true, coverImage: true },
  });
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      ...(post.coverImage && { images: [{ url: post.coverImage, alt: post.title }] }),
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  });

  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Organization", name: "Top Energies" },
    publisher: {
      "@type": "Organization",
      name: "Top Energies",
      logo: { "@type": "ImageObject", url: "https://topenergiesgroup.com/images/topenergies/logo-top-energies.png" },
    },
    datePublished: post.publishedAt?.toISOString() ?? post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    ...(post.coverImage && { image: post.coverImage }),
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://topenergiesgroup.com/blog/${post.slug}` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <header className="blog-site-header">
        <Link href="/" className="blog-site-brand">
          <BrandLogo compact />
        </Link>
        <nav className="blog-site-nav">
          <Link href="/">Boutique</Link>
          <Link href="/blog">Blog</Link>
        </nav>
      </header>

      <main className="blog-post-page">
        <nav className="blog-breadcrumb">
          <Link href="/">Accueil</Link>
          <ChevronRight size={13} />
          <Link href="/blog">Blog</Link>
          <ChevronRight size={13} />
          <span>{post.title}</span>
        </nav>

        <article className="blog-post-article">
          <header className="blog-post-header">
            <div className="blog-post-meta">
              <span className="blog-cat-badge">
                <Tag size={10} /> {post.category}
              </span>
              {post.publishedAt && (
                <span className="blog-card-date">
                  <CalendarDays size={11} /> {formatDate(post.publishedAt.toISOString())}
                </span>
              )}
            </div>
            <h1 className="blog-post-title">{post.title}</h1>
            <p className="blog-post-excerpt">{post.excerpt}</p>
          </header>

          {post.coverImage && (
            <div className="blog-post-cover">
              <img src={post.coverImage} alt={post.title} />
            </div>
          )}

          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <div className="blog-post-footer">
          <Link href="/blog" className="blog-back-btn">
            <ArrowLeft size={15} /> Retour au blog
          </Link>
          <Link href="/#catalogue" className="primary-button">
            Commander du gaz <ArrowRight size={15} />
          </Link>
        </div>
      </main>

      <footer className="blog-footer">
        <Link href="/" className="blog-footer-brand">
          <BrandLogo />
        </Link>
        <p>Votre energie, livree simplement.</p>
        <small>Top Energies &middot; Camberene, Dakar &middot; 33 835 54 09</small>
      </footer>
    </>
  );
}
