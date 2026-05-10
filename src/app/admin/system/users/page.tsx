import { SimpleTable } from "@/components/admin/simple-table";
import { listUsers } from "@/lib/admin-users";

export const metadata = {
  title: "用户管理"
};

export default async function UsersPage() {
  const users = await listUsers();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-ink/10 bg-white/85 p-6 shadow-card">
        <h1 className="font-display text-2xl font-semibold text-ink">用户管理</h1>
        <p className="mt-2 text-sm text-ink/65">查看当前注册用户、角色和账号状态。</p>
      </section>
      <SimpleTable
        columns={["用户名", "昵称", "角色", "状态", "创建时间"]}
        rows={users.map((user) => [user.username, user.nickname, user.roleName, user.status, new Date(user.createdAt).toLocaleString()])}
      />
    </div>
  );
}
