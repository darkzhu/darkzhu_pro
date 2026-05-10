"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { siteConfig } from "@/config/site";
import type { SessionUser } from "@/lib/auth-shared";

export function AuthNav() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function syncAuthState() {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      const body = (await response.json()) as { user: SessionUser | null };

      if (!ignore) {
        setUser(body.user);
      }
    }

    syncAuthState();
    window.addEventListener("auth-change", syncAuthState);

    return () => {
      ignore = true;
      window.removeEventListener("auth-change", syncAuthState);
    };
  }, []);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setIsOpen(false);
    window.dispatchEvent(new Event("auth-change"));
    router.refresh();
  }

  if (user) {
    const avatar = user.avatar || siteConfig.authorAvatar;

    return (
      <div className="flex items-center gap-2">
        <Link
          href="/admin"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-clay"
        >
          进入后台
        </Link>
        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-label="打开用户菜单"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
            className="h-10 w-10 overflow-hidden rounded-full border border-ink/10 bg-white shadow-sm transition hover:border-clay"
          >
            <Image src={avatar} alt={user.nickname} width={40} height={40} className="h-full w-full object-cover" />
          </button>
          {isOpen ? (
            <div className="absolute right-0 top-12 z-40 w-44 rounded-2xl border border-ink/10 bg-white/95 p-2 shadow-card backdrop-blur">
              <div className="border-b border-ink/10 px-3 py-2">
                <p className="truncate text-sm font-semibold text-ink">{user.nickname}</p>
                <p className="truncate text-xs text-ink/50">{user.provider}</p>
              </div>
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="mt-2 block rounded-xl px-3 py-2 text-sm font-medium text-ink/75 transition hover:bg-mist hover:text-clay"
              >
                个人设置
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-ink/75 transition hover:bg-mist hover:text-clay"
              >
                退出登录
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-clay"
    >
      登录
    </Link>
  );
}
