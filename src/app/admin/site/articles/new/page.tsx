import { PostManager } from "@/components/admin/post-manager";
import { getEditablePosts } from "@/lib/admin-posts";

export const metadata = {
  title: "发布文章"
};

export default function AdminNewArticlePage() {
  return <PostManager initialMode="new" initialPosts={getEditablePosts()} />;
}
