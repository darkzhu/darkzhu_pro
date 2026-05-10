import Link from "next/link";

import { getEditablePosts } from "@/lib/admin-posts";
import { getAllCategories, getAllTags } from "@/lib/posts";

export const metadata = {
  title: "后台首页"
};

export default function AdminHomePage() {
  const posts = getEditablePosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  const stats = [
    { label: "文章数量", value: posts.length },
    { label: "分类数量", value: categories.length },
    { label: "标签数量", value: tags.length }
  ];

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">Dashboard</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">后台首页</h1>
        <p className="mt-2 text-sm leading-6 text-ink/65">管理文章内容、站点信息和后端接口说明。</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <div key={item.label} className="rounded-2xl border border-ink/10 bg-white/85 p-5 shadow-card">
            <p className="text-sm font-medium text-ink/60">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-ink">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/site" className="rounded-2xl border border-ink/10 bg-white/85 p-5 shadow-card transition hover:-translate-y-0.5 hover:border-clay">
          <h2 className="text-lg font-semibold text-ink">网站管理</h2>
          <p className="mt-2 text-sm leading-6 text-ink/65">管理文章、留言、分类、标签、评论、树洞、聊天和友链。</p>
        </Link>
        <Link href="/admin/system" className="rounded-2xl border border-ink/10 bg-white/85 p-5 shadow-card transition hover:-translate-y-0.5 hover:border-clay">
          <h2 className="text-lg font-semibold text-ink">系统管理</h2>
          <p className="mt-2 text-sm leading-6 text-ink/65">查看环境配置、上传限制和数据库信息。</p>
        </Link>
        <Link href="/admin/docs" className="rounded-2xl border border-ink/10 bg-white/85 p-5 shadow-card transition hover:-translate-y-0.5 hover:border-clay">
          <h2 className="text-lg font-semibold text-ink">接口文档</h2>
          <p className="mt-2 text-sm leading-6 text-ink/65">查看认证、文章、上传、留言和弹幕接口。</p>
        </Link>
      </section>
    </div>
  );
}
