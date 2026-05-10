import { AnnouncementCard } from "@/components/sidebar/announcement-card";
import { ContentIndexCard } from "@/components/sidebar/content-index-card";
import { DailyQuoteCard } from "@/components/sidebar/daily-quote-card";
import { DigitalClock } from "@/components/sidebar/digital-clock";
import { ProfileCard } from "@/components/sidebar/profile-card";
import { RandomPostsCard } from "@/components/sidebar/random-posts-card";
import { SiteInfoCard } from "@/components/sidebar/site-info-card";
import type { PostSummary } from "@/types/post";

type SidebarItem = {
  name: string;
  count: number;
};

type BlogSidebarProps = {
  categories: SidebarItem[];
  tags: SidebarItem[];
  posts: PostSummary[];
  stats: {
    postCount: number;
    totalWords: number;
    lastUpdated: string;
  };
};

export function BlogSidebar({ categories, tags, posts, stats }: BlogSidebarProps) {
  return (
    <aside className="space-y-5">
      <ProfileCard />
      <AnnouncementCard />
      <DigitalClock />
      <RandomPostsCard posts={posts} />
      <DailyQuoteCard />
      <SiteInfoCard {...stats} />
      <ContentIndexCard categories={categories} tags={tags} />
    </aside>
  );
}
