import { getServiceMonitor } from "@/lib/admin-system";

export const metadata = {
  title: "服务监控"
};

function formatBytes(value: number) {
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

export default function MonitorPage() {
  const monitor = getServiceMonitor();
  const items = [
    { label: "Node 版本", value: monitor.nodeVersion },
    { label: "平台", value: monitor.platform },
    { label: "进程运行时长", value: `${monitor.uptime} 秒` },
    { label: "CPU 数量", value: String(monitor.cpuCount) },
    { label: "系统总内存", value: formatBytes(monitor.memory.total) },
    { label: "系统已用内存", value: formatBytes(monitor.memory.used) },
    { label: "负载", value: monitor.loadAverage.map((item) => item.toFixed(2)).join(" / ") }
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-ink/10 bg-white/85 p-6 shadow-card">
        <h1 className="font-display text-2xl font-semibold text-ink">服务监控</h1>
        <p className="mt-2 text-sm text-ink/65">查看当前 Node 服务和主机资源概览。</p>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-ink/10 bg-white/85 p-5 shadow-card">
            <p className="text-sm text-ink/55">{item.label}</p>
            <p className="mt-2 text-lg font-semibold text-ink">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
