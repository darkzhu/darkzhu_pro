import { SimpleTable } from "@/components/admin/simple-table";
import { listLoginLogs } from "@/lib/admin-system";

export const metadata = {
  title: "日志管理"
};

export default async function LogsPage() {
  const logs = await listLoginLogs();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-ink/10 bg-white/85 p-6 shadow-card">
        <h1 className="font-display text-2xl font-semibold text-ink">日志管理</h1>
        <p className="mt-2 text-sm text-ink/65">展示最近 200 条登录日志。</p>
      </section>
      <SimpleTable
        columns={["用户名", "IP", "结果", "说明", "时间"]}
        rows={logs.map((log) => [
          String(log.username),
          String(log.ip),
          Number(log.success) ? "成功" : "失败",
          String(log.message),
          new Date(String(log.createdAt)).toLocaleString()
        ])}
      />
    </div>
  );
}
