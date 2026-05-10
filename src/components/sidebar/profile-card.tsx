import Image from "next/image";

import { siteConfig } from "@/config/site";

export function ProfileCard() {
  return (
    <section className="rounded-[24px] border border-ink/10 bg-white/85 p-6 text-center shadow-card backdrop-blur">
      <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-mist shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
        <Image
          src={siteConfig.authorAvatar}
          alt={`${siteConfig.author} 的头像`}
          width={96}
          height={96}
          className="h-full w-full object-cover"
          priority
        />
      </div>
      <div className="mt-4 space-y-2">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">{siteConfig.author}</h2>
        <p className="text-sm leading-6 text-ink/68">{siteConfig.authorBio}</p>
      </div>
    </section>
  );
}
