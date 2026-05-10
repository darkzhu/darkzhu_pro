import { siteConfig } from "@/config/site";

export function DailyQuoteCard() {
  return (
    <section className="rounded-[28px] border border-ink/10 bg-white/85 p-6 shadow-card backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss">每日鸡汤</p>
      <p className="mt-4 text-base leading-8 text-ink/72">{siteConfig.dailyQuote}</p>
    </section>
  );
}
