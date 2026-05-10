import { SectionTitle } from "@/components/layout/section-title";
import { HomePostPreview } from "@/components/posts/home-post-preview";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "搜索文章"
};

type SearchPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q?.trim() ?? "";
  const keyword = query.toLowerCase();
  const posts = getAllPosts().filter((post) => {
    if (!keyword) {
      return true;
    }

    return [post.title, post.description, post.category, ...post.tags].some((value) =>
      value.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      <SectionTitle
        eyebrow="Search"
        title={query ? `搜索：${query}` : "搜索文章"}
        description={query ? `找到 ${posts.length} 篇相关文章。` : "在顶部搜索框输入关键词，可以按标题、摘要、分类和标签查找文章。"}
      />
      <div className="mt-10 grid gap-6">
        {posts.map((post) => (
          <HomePostPreview key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
