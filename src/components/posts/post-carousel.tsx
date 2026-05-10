"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { siteConfig } from "@/config/site";
import { normalizeImageUrl } from "@/lib/image-url";
import type { PostSummary } from "@/types/post";

type PostCarouselProps = {
  posts: PostSummary[];
};

function getCarouselPosts(posts: PostSummary[]) {
  return [...posts].sort((a, b) => a.slug.localeCompare(b.slug)).slice(0, 5);
}

export function PostCarousel({ posts }: PostCarouselProps) {
  const carouselPosts = useMemo(() => getCarouselPosts(posts), [posts]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (carouselPosts.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % carouselPosts.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [carouselPosts.length]);

  if (carouselPosts.length === 0) {
    return null;
  }

  function goToPrevious() {
    setActiveIndex((current) => (current - 1 + carouselPosts.length) % carouselPosts.length);
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % carouselPosts.length);
  }

  const activePost = carouselPosts[activeIndex];
  const cover = normalizeImageUrl(activePost.cover || siteConfig.defaultPostCover);

  return (
    <section className="group overflow-hidden rounded-[24px] border border-ink/10 bg-white/88 shadow-card">
      <div className="relative h-64 bg-mist sm:h-72 md:h-80">
        <Link href={`/posts/${activePost.slug}`} className="block h-full">
          {cover ? (
            <Image src={cover} alt={activePost.title} fill sizes="(min-width: 1024px) 720px, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.02]" unoptimized />
          ) : (
            <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(244,244,245,0.96))] text-sm font-semibold uppercase tracking-[0.2em] text-moss/70">
              Random Post Image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/18 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-paper sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-paper/70">随机文章</p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{activePost.title}</h2>
            <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-paper/78">{activePost.description}</p>
          </div>
        </Link>

        {carouselPosts.length > 1 ? (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="上一篇轮播文章"
              className="absolute left-3 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-[linear-gradient(135deg,rgba(255,255,255,0.5),rgba(255,255,255,0.18))] text-4xl font-light text-white opacity-0 shadow-card backdrop-blur-md transition hover:scale-105 hover:bg-white/35 group-hover:opacity-100 sm:left-5 sm:h-16 sm:w-16"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="下一篇轮播文章"
              className="absolute right-3 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-[linear-gradient(135deg,rgba(255,255,255,0.5),rgba(255,255,255,0.18))] text-4xl font-light text-white opacity-0 shadow-card backdrop-blur-md transition hover:scale-105 hover:bg-white/35 group-hover:opacity-100 sm:right-5 sm:h-16 sm:w-16"
            >
              ›
            </button>
          </>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div className="flex gap-2">
          {carouselPosts.map((post, index) => (
            <button
              key={post.slug}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`切换到 ${post.title}`}
              className={`h-2.5 rounded-full transition ${
                index === activeIndex ? "w-8 bg-clay" : "w-2.5 bg-ink/18 hover:bg-ink/35"
              }`}
            />
          ))}
        </div>
        <Link href={`/posts/${activePost.slug}`} className="text-sm font-semibold text-moss transition hover:text-clay">
          阅读这篇
        </Link>
      </div>
    </section>
  );
}
