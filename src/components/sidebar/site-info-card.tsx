"use client";

import { useEffect, useMemo, useState } from "react";

import { siteConfig } from "@/config/site";

type SiteInfoCardProps = {
  postCount: number;
  totalWords: number;
  lastUpdated: string;
};

const VISIT_KEY = "my-blog-visit-count";

function formatDuration(start: string) {
  const startedAt = new Date(start).getTime();
  const diff = Math.max(0, Date.now() - startedAt);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);

  return `${days} 天 ${hours} 小时`;
}

export function SiteInfoCard({ postCount, totalWords, lastUpdated }: SiteInfoCardProps) {
  const [visits, setVisits] = useState(0);
  const [duration, setDuration] = useState("");

  useEffect(() => {
    const nextVisits = Number(window.localStorage.getItem(VISIT_KEY) ?? "0") + 1;
    window.localStorage.setItem(VISIT_KEY, String(nextVisits));
    setVisits(nextVisits);
    setDuration(formatDuration(siteConfig.launchedAt));

    const timer = window.setInterval(() => setDuration(formatDuration(siteConfig.launchedAt)), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const rows = useMemo(
    () => [
      { label: "文章数目", value: `${postCount} 篇` },
      { label: "运行时长", value: duration || "计算中" },
      { label: "全站字数", value: `${totalWords.toLocaleString("zh-CN")} 字` },
      { label: "访问次数", value: `${visits} 次` },
      { label: "最后更新", value: lastUpdated || "暂无" }
    ],
    [duration, lastUpdated, postCount, totalWords, visits]
  );

  return (
    <section className="rounded-[28px] border border-ink/10 bg-white/85 p-6 shadow-card backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss">网站资讯</p>
      <div className="mt-5 grid gap-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between rounded-2xl bg-mist/70 px-4 py-3 text-sm">
            <span className="text-ink/58">{row.label}</span>
            <span className="font-semibold text-ink">{row.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
