import Image from "next/image";
import Link from "next/link";

import { BackToTop } from "@/components/layout/back-to-top";
import { SectionTitle } from "@/components/layout/section-title";
import { HomePostPreview } from "@/components/posts/home-post-preview";
import { PostCarousel } from "@/components/posts/post-carousel";
import { BlogSidebar } from "@/components/sidebar/blog-sidebar";
import { siteConfig } from "@/config/site";
import { getAllCategories, getAllPosts, getAllTags, getSitePostStats } from "@/lib/posts";

export default function HomePage() {
  const allPosts = getAllPosts();
  const posts = allPosts.slice(0, 3);
  const tags = getAllTags().slice(0, 8);
  const categories = getAllCategories();
  const stats = getSitePostStats();

  return (
    <div className="pb-16 sm:pb-20">
      <section className="relative min-h-[72svh] overflow-hidden rounded-b-[22px] sm:min-h-[78svh] sm:rounded-b-[28px]">
        <Image src={siteConfig.heroImage} alt="首页封面" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-black/18" />
        <Link
          href="#home-posts"
          aria-label="向下浏览文章"
          className="absolute bottom-5 left-1/2 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/20 bg-white/0 text-white opacity-55 transition hover:-translate-y-0.5 hover:opacity-100 sm:bottom-7 sm:h-12 sm:w-12"
        >
          <span aria-hidden="true" className="inline-block -translate-y-0.5 scale-x-[1.35] text-[1.7rem] font-light leading-none">
            v
          </span>
        </Link>
      </section>

      <BackToTop />

      <section id="home-posts" className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="min-w-0">
          <SectionTitle
            eyebrow="Latest Posts"
            title="最近文章"
            description="继续往 src/content/posts 里放 Markdown 文章，它们会自动出现在这里。"
          />
          <div className="mt-8 rounded-[18px] border border-ink/10 bg-white/85 px-5 py-3 text-sm font-semibold text-ink/70 shadow-card sm:rounded-[22px]">
            欢迎来到我的博客
          </div>
          <div className="mt-6">
            <PostCarousel posts={allPosts} />
          </div>
          <div className="mt-10 grid gap-6">
            {posts.map((post) => (
              <HomePostPreview key={post.slug} post={post} />
            ))}
          </div>
        </div>
        <BlogSidebar categories={categories} tags={tags} posts={allPosts} stats={stats} />
      </section>
    </div>
  );
}
