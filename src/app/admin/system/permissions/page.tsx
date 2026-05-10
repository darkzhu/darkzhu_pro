import { SimpleTable } from "@/components/admin/simple-table";
import { listPermissions } from "@/lib/admin-users";

export const metadata = {
  title: "权限管理"
};

export default async function PermissionsPage() {
  const permissions = await listPermissions();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-ink/10 bg-white/85 p-6 shadow-card">
        <h1 className="font-display text-2xl font-semibold text-ink">权限管理</h1>
        <p className="mt-2 text-sm text-ink/65">后台权限点列表，用于后续精细化控制菜单和接口。</p>
      </section>
      <SimpleTable
        columns={["权限名称", "权限编码", "描述"]}
        rows={permissions.map((permission) => [permission.name, permission.code, permission.description])}
      />
    </div>
  );
}
