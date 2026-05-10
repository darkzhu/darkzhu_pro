import { SectionTitle } from "@/components/layout/section-title";
import { PostCard } from "@/components/posts/post-card";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "文章"
};

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <SectionTitle
        eyebrow="All Posts"
        title="文章列表"
        description="所有非草稿文章都会从 Markdown 文件自动生成列表。"
      />
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
