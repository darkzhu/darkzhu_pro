"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function HeaderActions() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;

    setIsDark(shouldUseDark);
    document.documentElement.dataset.theme = shouldUseDark ? "dark" : "light";
  }, []);

  function toggleTheme() {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    document.documentElement.dataset.theme = nextIsDark ? "dark" : "light";
    window.localStorage.setItem("theme", nextIsDark ? "dark" : "light");
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const keyword = query.trim();

    if (keyword) {
      router.push(`/search?q=${encodeURIComponent(keyword)}`);
    } else {
      router.push("/search");
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="切换昼夜模式"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/80 text-base text-ink transition hover:border-clay hover:text-clay"
      >
        <span aria-hidden="true">{isDark ? "☀" : "☾"}</span>
      </button>
      <form onSubmit={handleSearch} className="hidden items-center rounded-full border border-ink/10 bg-white/80 px-3 py-2 md:flex">
        <span className="mr-2 text-sm text-moss" aria-hidden="true">
          ⌕
        </span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索文章"
          aria-label="搜索文章"
          className="w-24 bg-transparent text-sm text-ink outline-none placeholder:text-ink/45 lg:w-32"
        />
      </form>
      <Link
        href="/search"
        aria-label="搜索文章"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/80 text-base text-ink transition hover:border-clay hover:text-clay md:hidden"
      >
        <span aria-hidden="true">⌕</span>
      </Link>
    </div>
  );
}
