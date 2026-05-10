import Link from "next/link";

type CountItem = {
  name: string;
  count: number;
};

type ContentIndexCardProps = {
  categories: CountItem[];
  tags: CountItem[];
};

export function ContentIndexCard({ categories, tags }: ContentIndexCardProps) {
  return (
    <section className="rounded-[28px] border border-ink/10 bg-white/85 p-6 shadow-card backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss">内容索引</p>
      <div className="mt-6 grid gap-5">
        <div>
          <p className="text-sm font-semibold text-ink">分类</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/categories/${encodeURIComponent(category.name)}`}
                className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-ink transition hover:bg-sand"
              >
                {category.name} · {category.count}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">常用标签</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.name}
                href={`/tags/${encodeURIComponent(tag.name)}`}
                className="rounded-full border border-ink/10 bg-white px-3 py-1 text-xs font-medium text-ink/75 transition hover:border-clay hover:text-clay"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
