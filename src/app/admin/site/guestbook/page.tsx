import { InteractionManager } from "@/components/admin/interaction-manager";
import { listGuestbookAdmin } from "@/lib/admin-interactions";

export const metadata = {
  title: "留言管理"
};

export default async function AdminGuestbookPage() {
  return <InteractionManager module="guestbook" title="留言管理" initialItems={await listGuestbookAdmin()} />;
}
