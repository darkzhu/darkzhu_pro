import Link from "next/link";

import type { PostSummary } from "@/types/post";

type RandomPostsCardProps = {
  posts: PostSummary[];
};

function pickRandomPosts(posts: PostSummary[]) {
  return [...posts].sort((a, b) => a.slug.localeCompare(b.slug)).slice(0, 4);
}

export function RandomPostsCard({ posts }: RandomPostsCardProps) {
  const randomPosts = pickRandomPosts(posts);

  return (
    <section className="rounded-[28px] border border-ink/10 bg-white/85 p-6 shadow-card backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss">随机文章</p>
      <div className="mt-5 space-y-3">
        {randomPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="block rounded-2xl border border-ink/10 bg-white/75 p-4 transition hover:border-clay hover:text-clay"
          >
            <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-ink">{post.title}</h3>
            <p className="mt-1 text-xs text-ink/52">{post.date}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
