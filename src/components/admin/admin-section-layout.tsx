import Link from "next/link";

export type AdminSectionNavItem = {
  href: string;
  label: string;
  description?: string;
};

export function AdminSectionLayout({
  eyebrow,
  title,
  description,
  items,
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: AdminSectionNavItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="self-start rounded-2xl border border-ink/10 bg-white/85 p-4 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-moss">{eyebrow}</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-ink/60">{description}</p>
        <nav className="mt-5 space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-xl px-3 py-2 text-sm font-semibold text-ink/72 transition hover:bg-mist hover:text-clay"
            >
              <span>{item.label}</span>
              {item.description ? <span className="mt-1 block text-xs font-normal text-ink/45">{item.description}</span> : null}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="min-w-0">{children}</section>
    </div>
  );
}
