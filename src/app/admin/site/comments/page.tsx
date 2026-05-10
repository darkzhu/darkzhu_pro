import { InteractionManager } from "@/components/admin/interaction-manager";
import { listCommentsAdmin } from "@/lib/admin-interactions";

export const metadata = {
  title: "评论管理"
};

export default async function AdminCommentsPage() {
  return <InteractionManager module="comments" title="评论管理" initialItems={await listCommentsAdmin()} />;
}
