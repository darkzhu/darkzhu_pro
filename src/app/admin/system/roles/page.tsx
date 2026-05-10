import { SimpleTable } from "@/components/admin/simple-table";
import { listRoles } from "@/lib/admin-users";

export const metadata = {
  title: "角色管理"
};

export default async function RolesPage() {
  const roles = await listRoles();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-ink/10 bg-white/85 p-6 shadow-card">
        <h1 className="font-display text-2xl font-semibold text-ink">角色管理</h1>
        <p className="mt-2 text-sm text-ink/65">角色用于组织权限，管理员拥有全部后台权限。</p>
      </section>
      <SimpleTable
        columns={["角色名称", "角色编码", "描述", "权限"]}
        rows={roles.map((role) => [role.name, role.code, role.description, role.permissions.join(", ")])}
      />
    </div>
  );
}
