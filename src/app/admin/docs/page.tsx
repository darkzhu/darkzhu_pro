import Link from "next/link";

import { AdminSectionLayout } from "@/components/admin/admin-section-layout";
import { systemManagementItems } from "@/config/admin";

export const metadata = {
  title: "接口文档"
};

const apiGroups = [
  { title: "认证", items: ["POST /api/auth/login", "POST /api/auth/logout", "GET /api/auth/me"] },
  { title: "文章后台", items: ["GET /api/admin/posts", "POST /api/admin/posts", "PUT /api/admin/posts/{slug}", "DELETE /api/admin/posts/{slug}"] },
  { title: "通用记录", items: ["GET /api/admin/records/{module}", "POST /api/admin/records/{module}", "PUT /api/admin/records/{module}/{id}", "DELETE /api/admin/records/{module}/{id}"] },
  { title: "互动管理", items: ["GET /api/admin/interactions/{module}", "PUT /api/admin/interactions/{module}/{id}", "DELETE /api/admin/interactions/{module}/{id}"] }
];

export default function AdminDocsPage() {
  return (
    <AdminSectionLayout
      eyebrow="System"
      title="系统管理"
      description="查看运行环境、数据库、上传限制和接口说明。"
      items={systemManagementItems}
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-ink/10 bg-white/85 p-6 shadow-card">
          <h1 className="font-display text-2xl font-semibold text-ink">接口文档</h1>
          <p className="mt-2 text-sm leading-6 text-ink/65">
            完整 Markdown 文档在 <Link href="/docs/api.md" className="font-semibold text-clay">docs/api.md</Link>，这里列出后台常用接口。
          </p>
        </section>
        <div className="grid gap-4 md:grid-cols-2">
          {apiGroups.map((group) => (
            <section key={group.title} className="rounded-2xl border border-ink/10 bg-white/85 p-5 shadow-card">
              <h2 className="text-lg font-semibold text-ink">{group.title}</h2>
              <div className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <code key={item} className="block rounded-lg bg-mist px-3 py-2 text-sm text-ink">
                    {item}
                  </code>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </AdminSectionLayout>
  );
}
