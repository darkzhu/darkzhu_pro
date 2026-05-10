"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";

export function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "关闭导航菜单" : "打开导航菜单"}
        aria-expanded={isOpen}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/80 text-ink transition hover:border-clay hover:text-clay"
      >
        <span aria-hidden="true" className="text-xl leading-none">
          {isOpen ? "x" : "☰"}
        </span>
      </button>

      {isOpen ? (
        <div className="fixed inset-0 top-[72px] z-40 bg-mist sm:top-[84px]">
          <nav className="mx-4 mt-3 max-h-[calc(100svh-96px)] overflow-y-auto rounded-[24px] border border-ink/10 bg-white p-3 shadow-card">
            {siteConfig.nav.map((item) => (
              <div key={item.href} className="border-b border-ink/10 py-2 last:border-b-0">
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold text-ink transition hover:bg-mist"
                >
                  <span className="w-6 text-sm text-ink/55" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
                {item.children ? (
                  <div className="ml-9 mt-1 grid gap-1 pb-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink/68 transition hover:bg-mist hover:text-ink"
                      >
                        <span className="w-5 text-xs text-ink/45" aria-hidden="true">
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
      ) : null}
    </div>
  );
}
