"use client";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="返回顶部"
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-ink/10 bg-white/85 text-ink shadow-card transition hover:-translate-y-0.5 hover:bg-white sm:bottom-6 sm:right-6"
    >
      ↑
    </button>
  );
}
