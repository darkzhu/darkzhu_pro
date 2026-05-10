export const metadata = {
  title: "系统管理"
};

export default function AdminSystemPage() {
  const items = [
    { label: "数据库", value: process.env.MYSQL_DATABASE || "未配置" },
    { label: "数据库主机", value: `${process.env.MYSQL_HOST || "未配置"}:${process.env.MYSQL_PORT || "3306"}` },
    { label: "上传大小限制", value: `${Number(process.env.UPLOAD_MAX_BYTES || 5 * 1024 * 1024) / 1024 / 1024} MB` },
    { label: "运行环境", value: process.env.NODE_ENV || "development" }
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-ink/10 bg-white/85 p-6 shadow-card">
        <h2 className="font-display text-2xl font-semibold text-ink">系统概览</h2>
        <p className="mt-2 text-sm leading-6 text-ink/65">当前后台连接 MySQL，并使用环境变量控制认证、上传和数据库配置。</p>
      </section>
      <div className="rounded-2xl border border-ink/10 bg-white/85 shadow-card">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between border-b border-ink/10 px-5 py-4 last:border-b-0">
            <span className="text-sm font-medium text-ink/60">{item.label}</span>
            <span className="text-sm font-semibold text-ink">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
