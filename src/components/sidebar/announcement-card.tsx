import Link from "next/link";

import { siteConfig } from "@/config/site";

export function AnnouncementCard() {
  return (
    <section className="rounded-[28px] border border-ink/10 bg-white/85 p-5 shadow-card backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist text-xl text-clay">
          <span aria-hidden="true">📣</span>
        </div>
        <p className="min-w-0 flex-1 text-sm leading-6 text-ink/72">{siteConfig.announcement.text}</p>
        <Link
          href={siteConfig.announcement.href}
          aria-label="查看公告详情"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-paper text-lg font-semibold text-ink transition hover:border-clay hover:bg-clay hover:text-white"
        >
          <span aria-hidden="true">›</span>
        </Link>
      </div>
    </section>
  );
}
