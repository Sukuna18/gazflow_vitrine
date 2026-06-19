import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import BrandLogo from "@/components/BrandLogo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — Conseils gaz, actualites et securite",
  description:
    "Conseils pratiques sur le gaz butane, la securite, l'installation et l'entretien de vos equipements. Actualites Top Energies a Dakar.",
  openGraph: {
    title: "Blog Top Energies | Conseils gaz et actualites",
    description: "Conseils, securite, actualites sur le gaz butane a Dakar.",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true, slug: true, title: true, excerpt: true,
      coverImage: true, category: true, publishedAt: true,
    },
  });

  return (
    <>
      <header className="blog-site-header">
        <Link href="/" className="blog-site-brand">
          <BrandLogo compact />
        </Link>
        <nav className="blog-site-nav">
          <Link href="/">Boutique</Link>
          <Link href="/blog" className="active">Blog</Link>
        </nav>
      </header>

      <main className="blog-page">
        <section className="blog-hero">
          <p className="eyebrow orange">Ressources &amp; Actualites</p>
          <h1>Notre blog</h1>
          <p className="blog-hero-desc">
            Conseils de securite, guides d&rsquo;installation, actualites sur le gaz butane et
            l&rsquo;energie a Dakar et au Senegal.
          </p>
        </section>

        {posts.length === 0 ? (
          <div className="blog-empty">
            <BookOpen size={40} />
            <p>Aucun article publie pour le moment.</p>
            <Link href="/" className="primary-button">
              Retour a la boutique <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => (
              <article key={post.id} className="blog-card">
                {post.coverImage ? (
                  <Link href={`/blog/${post.slug}`} className="blog-card-img-wrap">
                    <img src={post.coverImage} alt={post.title} className="blog-card-img" />
                  </Link>
                ) : (
                  <Link href={`/blog/${post.slug}`} className="blog-card-img-wrap blog-card-img-placeholder">
                    <BookOpen size={32} />
                  </Link>
                )}
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span className="blog-cat-badge">
                      <Tag size={10} /> {post.category}
                    </span>
                    {post.publishedAt && (
                      <span className="blog-card-date">
                        <CalendarDays size={11} /> {formatDate(post.publishedAt.toISOString())}
                      </span>
                    )}
                  </div>
                  <h2 className="blog-card-title">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="blog-card-cta">
                    Lire l&rsquo;article <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="blog-footer">
        <Link href="/" className="blog-footer-brand">
          <BrandLogo />
        </Link>
        <p>Votre energie, livree simplement.</p>
        <Link href="/" className="primary-button">
          <ArrowLeft size={15} /> Retour a la boutique
        </Link>
      </footer>
    </>
  );
}
