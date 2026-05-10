import Link from "next/link";
import Image from "next/image";

import { TagPill } from "@/components/posts/tag-pill";
import { siteConfig } from "@/config/site";
import { normalizeImageUrl } from "@/lib/image-url";
import type { PostSummary } from "@/types/post";

type HomePostPreviewProps = {
  post: PostSummary;
};

function getPseudoViews(post: PostSummary) {
  return Math.max(128, post.readingTime * 86 + post.title.length * 13);
}

export function HomePostPreview({ post }: HomePostPreviewProps) {
  const cover = normalizeImageUrl(post.cover || siteConfig.defaultPostCover);
  const views = getPseudoViews(post);
  const updatedAt = post.date;

  return (
    <article className="grid overflow-hidden rounded-[22px] border border-ink/10 bg-white/88 shadow-card backdrop-blur transition hover:-translate-y-1 sm:rounded-[24px] lg:grid-cols-[42%_1fr]">
      <Link href={`/posts/${post.slug}`} className="relative block min-h-52 bg-mist sm:min-h-64">
        {cover ? (
          <Image src={cover} alt={post.title} fill sizes="(min-width: 1024px) 420px, 100vw" className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full min-h-52 items-center justify-center border-b border-ink/10 bg-mist text-sm font-semibold text-moss/70 sm:min-h-64 lg:border-b-0 lg:border-r">
            文章图片
          </div>
        )}
      </Link>
      <div className="flex flex-col justify-center gap-4 p-5 sm:p-7 md:p-9">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink transition hover:text-clay sm:text-3xl">
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </h2>

        <div className="flex flex-wrap items-center gap-3 text-sm text-ink/60">
          <span>浏览量 {views}</span>
          <span>评论 0</span>
          <span>点赞 0</span>
          <span>收藏 0</span>
        </div>

        <time className="text-sm font-medium text-ink/55" dateTime={post.date}>
          {post.date}
        </time>

        <div className="flex flex-wrap gap-2">
          <Link href={`/categories/${encodeURIComponent(post.category)}`}>
            <TagPill label={post.category} />
          </Link>
          {post.tags.map((tag) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
              <TagPill label={tag} />
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 text-xs font-medium text-ink/50">
          <span>发布时间 {post.date}</span>
          <span>更新于 {updatedAt}</span>
        </div>

        <p className="text-base leading-8 text-ink/70">{post.description}</p>
      </div>
    </article>
  );
}
