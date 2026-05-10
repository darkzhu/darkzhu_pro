import Link from "next/link";

import { TagPill } from "@/components/posts/tag-pill";
import type { PostSummary } from "@/types/post";

type PostCardProps = {
  post: PostSummary;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group rounded-[28px] border border-ink/10 bg-white p-6 shadow-card transition hover:-translate-y-1">
      <div className="mb-5 flex items-center justify-between gap-4 text-sm text-ink/55">
        <span>{post.date}</span>
        <Link
          href={`/categories/${encodeURIComponent(post.category)}`}
          className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-ink transition hover:bg-sand"
        >
          {post.category}
        </Link>
      </div>
      <div className="space-y-4">
        <h3 className="font-display text-2xl font-semibold tracking-tight text-ink transition group-hover:text-clay">
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-base leading-7 text-ink/70">{post.description}</p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
            <TagPill label={tag} />
          </Link>
        ))}
      </div>
    </article>
  );
}
