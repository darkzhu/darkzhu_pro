import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TagPill } from "@/components/posts/tag-pill";
import { PostInteractions } from "@/components/posts/post-interactions";
import { siteConfig } from "@/config/site";
import { normalizeImageUrl } from "@/lib/image-url";
import { getAllPostSlugs, getAdjacentPosts, getPostBySlug } from "@/lib/posts";
import { absoluteUrl } from "@/lib/seo";

type PostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({
    slug
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "文章不存在"
    };
  }

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: siteConfig.author }],
    alternates: {
      canonical: absoluteUrl(`/posts/${post.slug}`)
    },
    openGraph: {
      type: "article",
      url: absoluteUrl(`/posts/${post.slug}`),
      title: post.title,
      description: post.description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      publishedTime: post.date,
      authors: [siteConfig.author],
      tags: post.tags
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description
    }
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const adjacentPosts = getAdjacentPosts(post.slug);
  const cover = normalizeImageUrl(post.cover || siteConfig.defaultPostCover);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <Link href="/posts" className="text-sm font-semibold text-moss transition hover:text-clay">
        返回文章列表
      </Link>

      <article className="mt-6 rounded-[32px] border border-ink/10 bg-white/90 p-8 shadow-card md:p-10">
        {cover ? (
          <div className="relative -mx-8 -mt-8 mb-8 h-72 overflow-hidden rounded-t-[32px] bg-mist md:-mx-10 md:-mt-10 md:h-96">
            <Image
              src={cover}
              alt={post.title}
              fill
              sizes="(min-width: 768px) 896px, 100vw"
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="-mx-8 -mt-8 mb-8 flex h-72 items-center justify-center rounded-t-[32px] border-b border-ink/10 bg-[linear-gradient(135deg,rgba(255,214,231,0.9),rgba(255,247,251,0.94))] text-sm font-semibold text-moss/70 md:-mx-10 md:-mt-10 md:h-96">
            文章顶部图片占位
          </div>
        )}
        <div className="space-y-5 border-b border-ink/10 pb-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-ink/60">
            <span>{post.date}</span>
            <span className="h-1 w-1 rounded-full bg-ink/30" />
            <Link href={`/categories/${encodeURIComponent(post.category)}`} className="transition hover:text-clay">
              {post.category}
            </Link>
            <span className="h-1 w-1 rounded-full bg-ink/30" />
            <span>{post.readingTime} 分钟阅读</span>
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            {post.title}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-ink/72">{post.description}</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
                <TagPill label={tag} />
              </Link>
            ))}
          </div>
        </div>

        <div className="prose mt-8" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>

      <PostInteractions slug={post.slug} />

      <nav className="mt-8 grid gap-4 md:grid-cols-2">
        {adjacentPosts.previous ? (
          <Link
            href={`/posts/${adjacentPosts.previous.slug}`}
            className="rounded-2xl border border-ink/10 bg-white/80 p-5 transition hover:border-clay"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-moss">上一篇</span>
            <p className="mt-2 font-semibold text-ink">{adjacentPosts.previous.title}</p>
          </Link>
        ) : (
          <div />
        )}
        {adjacentPosts.next ? (
          <Link
            href={`/posts/${adjacentPosts.next.slug}`}
            className="rounded-2xl border border-ink/10 bg-white/80 p-5 text-right transition hover:border-clay"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-moss">下一篇</span>
            <p className="mt-2 font-semibold text-ink">{adjacentPosts.next.title}</p>
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
