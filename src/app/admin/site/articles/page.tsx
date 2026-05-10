import { PostManager } from "@/components/admin/post-manager";
import { getEditablePosts } from "@/lib/admin-posts";

export const metadata = {
  title: "文章列表"
};

export default async function AdminArticlesPage() {
  return <PostManager initialMode="list" initialPosts={await getEditablePosts()} />;
}
