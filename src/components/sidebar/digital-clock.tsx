"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long"
});

function formatTime(date: Date) {
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
}

export function DigitalClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);

    return () => window.clearInterval(timer);
  }, []);

  const dateText = now ? formatter.format(now) : "正在同步日期";
  const timeText = now ? formatTime(now) : "--:--:--";

  return (
    <section className="rounded-[24px] border border-ink/10 bg-white p-6 text-ink shadow-card">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/50">Digital Clock</p>
      <time dateTime={now?.toISOString()} className="mt-4 block font-display text-4xl font-semibold tabular-nums tracking-tight">
        {timeText}
      </time>
      <p className="mt-3 text-sm font-medium text-ink/62">{dateText}</p>
    </section>
  );
}
