import Link from "next/link";

import { SectionTitle } from "@/components/layout/section-title";
import { getArchiveGroups } from "@/lib/posts";

export const metadata = {
  title: "归档"
};

export default function ArchivePage() {
  const groups = getArchiveGroups();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <SectionTitle
        eyebrow="Archive"
        title="文章归档"
        description="按年份整理所有已经发布的文章，适合快速回看写作历史。"
      />

      <div className="mt-10 space-y-10">
        {groups.map((group) => (
          <section key={group.year}>
            <h2 className="font-display text-3xl font-semibold text-ink">{group.year}</h2>
            <div className="mt-5 divide-y divide-ink/10 rounded-[24px] border border-ink/10 bg-white/85 shadow-card">
              {group.posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  className="grid gap-2 p-5 transition hover:bg-paper/80 md:grid-cols-[8rem_1fr_auto] md:items-center"
                >
                  <span className="text-sm text-ink/55">{post.date}</span>
                  <span className="font-semibold text-ink">{post.title}</span>
                  <span className="text-sm text-ink/55">{post.category}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
