"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SakuraFall } from "@/components/layout/sakura-fall";
import { siteConfig } from "@/config/site";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";
  const isLogin = pathname === "/login";

  return (
    <div className={`relative ${isHome ? "overflow-x-hidden" : ""}`}>
      {!isAdmin && !isHome && !isLogin ? (
        <div className="fixed inset-0 -z-10">
          <Image src={siteConfig.heroImage} alt="" aria-hidden="true" fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-white/68 backdrop-blur-[1px] dark:bg-black/58" />
        </div>
      ) : null}
      {!isAdmin && !isLogin ? <SakuraFall /> : null}
      {!isAdmin ? <Header /> : null}
      <main className={isHome || isLogin ? "pt-0" : "pt-20 sm:pt-24"}>{children}</main>
      {!isAdmin && !isLogin ? <Footer /> : null}
    </div>
  );
}
