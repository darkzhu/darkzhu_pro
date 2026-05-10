import Link from "next/link";

import { SectionTitle } from "@/components/layout/section-title";
import { getAllCategories } from "@/lib/posts";

export const metadata = {
  title: "分类"
};

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <SectionTitle eyebrow="Categories" title="分类" description="按内容方向整理文章。" />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/categories/${encodeURIComponent(category.name)}`}
            className="rounded-[24px] border border-ink/10 bg-white/85 p-6 shadow-card transition hover:-translate-y-1 hover:border-clay"
          >
            <h2 className="font-display text-2xl font-semibold text-ink">{category.name}</h2>
            <p className="mt-2 text-sm text-ink/60">{category.count} 篇文章</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
