import { SimpleTable } from "@/components/admin/simple-table";
import { listMenus } from "@/lib/admin-system";

export const metadata = {
  title: "菜单管理"
};

export default async function MenusPage() {
  const menus = await listMenus();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-ink/10 bg-white/85 p-6 shadow-card">
        <h1 className="font-display text-2xl font-semibold text-ink">菜单管理</h1>
        <p className="mt-2 text-sm text-ink/65">维护后台菜单路径、排序、权限编码和启用状态。</p>
      </section>
      <SimpleTable
        columns={["标题", "路径", "权限", "排序", "状态"]}
        rows={menus.map((menu) => [String(menu.title), String(menu.href), String(menu.permissionCode || ""), String(menu.sortOrder), String(menu.status)])}
      />
    </div>
  );
}
