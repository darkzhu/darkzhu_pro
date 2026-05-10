import Link from "next/link";

import { AuthNav } from "@/components/auth/auth-nav";
import { HeaderActions } from "@/components/layout/header-actions";
import { MobileNav } from "@/components/layout/mobile-nav";
import { siteConfig } from "@/config/site";

export function Header() {
  return (
    <header className="fixed left-0 top-0 z-30 w-full border-b border-white/6 bg-black/4 backdrop-blur-md">
      <div className="flex w-full items-center justify-between gap-3 py-4 pl-0 pr-4 sm:gap-4 sm:py-5 sm:pr-6">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-5">
          <Link href="/" className="truncate font-display text-2xl font-semibold tracking-tight text-white">
            {siteConfig.name}
          </Link>
          <nav className="hidden flex-nowrap items-center gap-2 text-sm font-medium text-white/88 md:flex md:flex-wrap">
            {siteConfig.nav.map((item) => (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 transition hover:bg-white/12 hover:text-white"
                >
                  <span className="text-xs text-white/76" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.children ? (
                    <span className="text-xs text-white/60 transition group-hover:rotate-180" aria-hidden="true">
                      ↓
                    </span>
                  ) : null}
                </Link>
                {item.children ? (
                  <div className="invisible absolute left-0 top-full z-30 min-w-36 translate-y-2 rounded-[18px] border border-white/12 bg-black/55 p-2 opacity-0 shadow-card backdrop-blur-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/82 transition hover:bg-white/10 hover:text-white"
                      >
                        <span className="w-5 text-xs text-white/74" aria-hidden="true">
                          {child.icon}
                        </span>
                        <span>{child.label}</span>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <HeaderActions />
          <AuthNav />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
