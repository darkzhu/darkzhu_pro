import Link from "next/link";

import type { SessionUser } from "@/lib/auth-shared";

const adminNav = [
  { href: "/admin", label: "首页" },
  { href: "/admin/site", label: "网站管理" },
  { href: "/admin/system", label: "系统管理" },
  { href: "/admin/docs", label: "接口文档" }
];

export function AdminShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f3ef] text-ink">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex min-w-0 flex-wrap items-center gap-6">
            <Link href="/admin" className="font-display text-2xl font-semibold tracking-tight text-ink">
              博客后台
            </Link>
            <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink/70">
              {adminNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 transition hover:bg-mist hover:text-clay"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-ink/60 sm:inline">当前用户：{user.nickname}</span>
            <Link
              href="/"
              className="rounded-full border border-ink/15 px-4 py-2 font-semibold text-ink transition hover:border-clay hover:text-clay"
            >
              跳转前台
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
