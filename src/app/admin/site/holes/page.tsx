import { InteractionManager } from "@/components/admin/interaction-manager";
import { listHolesAdmin } from "@/lib/admin-interactions";

export const metadata = {
  title: "树洞管理"
};

export default async function AdminHolesPage() {
  return <InteractionManager module="holes" title="树洞管理" initialItems={await listHolesAdmin()} />;
}
