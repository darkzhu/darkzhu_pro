import Link from "next/link";

import { SectionTitle } from "@/components/layout/section-title";
import { getAllTags } from "@/lib/posts";

export const metadata = {
  title: "标签"
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <SectionTitle eyebrow="Tags" title="标签" description="用标签快速找到同一主题下的文章。" />
      <div className="mt-10 flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            href={`/tags/${encodeURIComponent(tag.name)}`}
            className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-medium text-ink/75 transition hover:border-clay hover:text-clay"
          >
            #{tag.name} · {tag.count}
          </Link>
        ))}
      </div>
    </div>
  );
}
